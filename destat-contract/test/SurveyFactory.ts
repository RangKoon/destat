import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

describe("SurveyFactory Contract", () => {
  let factory: any, owner: any, respondent1: any, respondent2: any;
  let ethers: any;

  const defaultQuestions: Question[] = [
    {
      question: "블록체인 기술을 알고 있나요?",
      options: ["예", "아니오", "잘 모름"],
    },
  ];

  beforeEach(async () => {
    const hre = await network.connect();
    ethers = hre.ethers;

    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"),
      ethers.parseEther("0.1"),
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    expect(await factory.min_pool_amount()).to.equal(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).to.equal(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    
    const schema = {
      title: "테스트 설문",
      description: "설문 설명",
      targetNumber: 100,
      questions: defaultQuestions,
    };

    const tx = await factory.createSurvey(schema, {
      value: ethers.parseEther("100"),
    });

    
    await expect(tx)
      .to.emit(factory, "SurveyCreated")
      .withArgs((addr: string) => ethers.isAddress(addr));

    
    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    const schema = {
      title: "테스트 설문",
      description: "설문 설명",
      targetNumber: 100,
      questions: defaultQuestions,
    };

    
    await expect(
      factory.createSurvey(schema, { value: ethers.parseEther("10") })
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    const schema = {
      title: "테스트 설문",
      description: "설문 설명",
      
      targetNumber: 1000,
      questions: defaultQuestions,
    };

    await expect(
      factory.createSurvey(schema, { value: ethers.parseEther("50") })
    ).to.be.revertedWith("Insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    const schema1 = {
      title: "첫 번째 설문",
      description: "설명 1",
      targetNumber: 100,
      questions: defaultQuestions,
    };
    const schema2 = {
      title: "두 번째 설문",
      description: "설명 2",
      targetNumber: 200,
      questions: defaultQuestions,
    };

    
    await factory.createSurvey(schema1, { value: ethers.parseEther("100") });
    await factory.createSurvey(schema2, { value: ethers.parseEther("100") });

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(2);

    
    expect(ethers.isAddress(surveys[0])).to.be.true;
    expect(ethers.isAddress(surveys[1])).to.be.true;

    
    expect(surveys[0]).to.not.equal(surveys[1]);
  });
});
