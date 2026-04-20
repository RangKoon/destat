import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

describe("Survey init", () => {
  const title = "막무가내 설문조사라면";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
        "상관없음",
      ],
    },
  ];

  const getSurveyContractAndEthers = async (survey: {
    title: string;
    description: string;
    targetNumber: number;
    questions: Question[];
  }) => {
    const { ethers } = await network.connect();
    const cSurvey = await ethers.deployContract("Survey", [
      survey.title,
      survey.description,
      survey.targetNumber,
      survey.questions,
    ]);
    return { ethers, cSurvey };
  };

  describe("Deployment", () => {
    it("should store survey info correctly", async () => {
      const targetNumber = 10;
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
      });

      expect(await cSurvey.title()).to.equal(title);
      expect(await cSurvey.description()).to.equal(description);
      expect(await cSurvey.targetNumber()).to.equal(targetNumber);
    });

    it("should calculate rewardAmount correctly", async () => {
      const targetNumber = 5;
      const { ethers } = await network.connect();
      const totalValue = ethers.parseEther("1");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value: totalValue }
      );

      const expectedReward = totalValue / BigInt(targetNumber);
      expect(await cSurvey.rewardAmount()).to.equal(expectedReward);
    });
  });

  describe("Questions and Answers", () => {
    it("should return questions correctly", async () => {
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 10,
        questions,
      });

      const result = await cSurvey.getQuestions();
      expect(result.length).to.equal(questions.length);
      expect(result[0].question).to.equal(questions[0].question);
      expect(result[0].options[0]).to.equal(questions[0].options[0]);
      expect(result[0].options[1]).to.equal(questions[0].options[1]);
      expect(result[0].options[2]).to.equal(questions[0].options[2]);
    });

    it("should allow valid answer submission", async () => {
      const { ethers } = await network.connect();
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, 3, questions],
        { value: ethers.parseEther("0.3") }
      );

      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();

      await cSurvey.submitAnswer({ respondent: signerAddress, answers: [1] });

      const answers = await cSurvey.getAnswers();
      expect(answers.length).to.equal(1);
      expect(answers[0].respondent).to.equal(signerAddress);
      expect(answers[0].answers[0]).to.equal(1);
    });

    it("should revert if answer length mismatch", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 3,
        questions,
      });

      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();

      // questions.length == 1, but submitting 2 answers
      await expect(
        cSurvey.submitAnswer({ respondent: signerAddress, answers: [0, 1] })
      ).to.be.revertedWith("Mismatched answers length");
    });

    it("should revert if target reached", async () => {
      const targetNumber = 1;
      const { ethers } = await network.connect();
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value: ethers.parseEther("0.1") }
      );

      const [signer1, signer2] = await ethers.getSigners();

      // First submission fills the target
      await cSurvey
        .connect(signer1)
        .submitAnswer({ respondent: await signer1.getAddress(), answers: [0] });

      // Second submission should revert
      await expect(
        cSurvey
          .connect(signer2)
          .submitAnswer({ respondent: await signer2.getAddress(), answers: [0] })
      ).to.be.revertedWith("This survey has been ended");
    });
  });

  describe("Rewards", () => {
    it("should pay correct reward to respondent", async () => {
      const targetNumber = 4;
      const { ethers } = await network.connect();
      const totalValue = ethers.parseEther("0.4");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value: totalValue }
      );

      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();
      const expectedReward = totalValue / BigInt(targetNumber);

      const balanceBefore = await ethers.provider.getBalance(signerAddress);
      const tx = await cSurvey
        .connect(signer)
        .submitAnswer({ respondent: signerAddress, answers: [0] });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(signerAddress);

      expect(balanceAfter - balanceBefore + gasUsed).to.equal(expectedReward);
    });
  });
});
