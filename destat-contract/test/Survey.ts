import { expect } from "chai";
import { ECDH } from "crypto";
import { network } from "hardhat";
import { keccak256, QuickNodeProvider, toUtf8Bytes } from "ethers";

interface Question {
    question: string;
    options: string[];
}

it("Survey storage layout", async () => {
    const { ethers } = await network.connect();

    const title = "막무가내 설문조사";
    const description = 
    "중앙화된 설문조서로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
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
    
    const factory = await ethers.deployContract("SurveyFactory", [
        ethers.parseEther("50"),
        ethers.parseEther("0.1"),
    ]);
    const survey = await ethers.deployContract("Survey",[
        
        title,
        description,
        100,
        questions,]
        ,
        {
        value: ethers.parseEther("100"),
        },
    );

    const slot0Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(0, 32));
    const slot1Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(1, 32));
    const slot2Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(2, 32));
    const slot3Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(3, 32));
    const slot4Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(4, 32));
    const slot5Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(5, 32));
    const slot6Data = await ethers.provider.getStorage(survey.getAddress(), ethers.toBeHex(6, 32));
    
    const decodeUni = (hex: string) => Buffer.from(hex.slice(2), "hex").toString("utf-8")
    const nextHash = (hex:string, i:number) => 
        "0x" + (BigInt(hex) + BigInt(i)).toString(16);
    
    console.log(slot0Data);

    console.log("primitive types")
    console.log(slot2Data);
    console.log(slot3Data);
   
    console.log("long string types")
    console.log(slot1Data)

    const pDesc = keccak256(ethers.toBeHex(1, 32));
    const desc0 = await ethers.provider.getStorage(
        await survey.getAddress(), 
        nextHash(pDesc, 0)
    );
    const desc1 = await ethers.provider.getStorage(
        await survey.getAddress(), 
        nextHash(pDesc, 1)
    );
    const desc2 = await ethers.provider.getStorage(
        await survey.getAddress(), 
        nextHash(pDesc, 2)
    );
    const desc3  = await ethers.provider.getStorage(
        await survey.getAddress(), 
        nextHash(pDesc, 3)
    );
    const desc4  = await ethers.provider.getStorage(
        await survey.getAddress(), 
        nextHash(pDesc, 4)
    );

    
    console.log(desc0);
    console.log(desc1);
    console.log(desc2);
    console.log(desc3);
    console.log(desc4);

    // Array type
    // pQuestions: 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b
    // pQuestions + 1 : 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19c

    // question1  <--------- pQuestions
    // question1_option[] <- pQuestions + 1
    // question2  <--------- pQuestions + 2
    // question2_option[] <- pQuestions + 3
    console.log("\n--- array & structure type ---");
    console.log("slot4Data", slot4Data);
    const pQuestions = keccak256(ethers.toBeHex(4, 32))
    const question1 = await ethers.provider.getStorage(survey.getAddress(), nextHash(pQuestions, 0));
    const question1_option_array = await ethers.provider.getStorage(survey.getAddress(), nextHash(pQuestions, 1));
    const question2 = await ethers.provider.getStorage(survey.getAddress(), nextHash(pQuestions, 2));
    const question2_option_array = await ethers.provider.getStorage(survey.getAddress(), nextHash(pQuestions, 3));
    
    console.log("question1", question1);
    console.log("question1_option[]", question1_option_array);
    console.log("question2", question2, decodeUni(question2));
    console.log("question2_option[]", question2_option_array);


    // map
    // map[keccak256(k, slot address)]
    console.log(slot6Data);
    const addr = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
    const mapKeyAddr = keccak256(
        ethers.toBeHex(addr, 32) + ethers.toBeHex(6, 32).slice(2)
    );
    const map1Value = await ethers.provider.getStorage(
        survey.getAddress(), 
        mapKeyAddr,
    );
    console.log(map1Value);
});