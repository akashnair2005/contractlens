import type { Rule } from "@/types";
import { paymentRules } from "./payment";
import { ipRules } from "./ip";
import { terminationRules } from "./termination";
import { liabilityRules } from "./liability";
import { confidentialityRules } from "./confidentiality";
import { restrictionsRules } from "./restrictions";
import { renewalRules } from "./renewal";
import { penaltiesRules } from "./penalties";
import { disputesRules } from "./disputes";

export const allRules: Rule[] = [
  ...liabilityRules,
  ...ipRules,
  ...terminationRules,
  ...paymentRules,
  ...renewalRules,
  ...restrictionsRules,
  ...confidentialityRules,
  ...penaltiesRules,
  ...disputesRules,
];

export {
  paymentRules,
  ipRules,
  terminationRules,
  liabilityRules,
  confidentialityRules,
  restrictionsRules,
  renewalRules,
  penaltiesRules,
  disputesRules,
};
