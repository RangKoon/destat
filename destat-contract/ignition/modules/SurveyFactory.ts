import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("SurveyFactoryModule", (m) => {
  const SurveyFactory = m.contract("SurveyFactory", [
    ethers.parseEther("50"),
    ethers.parseEther("0.5"),

  ]);

  // m.call(SurveyFactory, "incBy", [5n]);

  return { SurveyFactory };
});
