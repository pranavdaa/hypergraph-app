import { Entity, Type } from '@graphprotocol/hypergraph';

export class Image extends Entity.Class<Image>('Image')({
  url: Type.String
}) {}

export class Project extends Entity.Class<Project>('Project')({
  name: Type.String,
  description: Type.String,
  x: Type.String,
  avatar: Type.Relation(Image)
}) {}

export class Dapp extends Entity.Class<Dapp>('Dapp')({
  name: Type.String,
  description: Type.String,
  x: Type.String,
  github: Type.String,
  avatar: Type.Relation(Image)
}) {}

export class Investor extends Entity.Class<Investor>('Investor')({
  name: Type.String
}) {}

export class FundingStage extends Entity.Class<FundingStage>('FundingStage')({
  name: Type.String
}) {}

export class InvestmentRound extends Entity.Class<InvestmentRound>('InvestmentRound')({
  name: Type.String,
  raisedAmount: Type.Number,
  investors: Type.Relation(Investor),
  fundingStages: Type.Relation(FundingStage),
  raisedBy: Type.Relation(Project)
}) {}

export class Asset extends Entity.Class<Asset>('Asset')({
  name: Type.String,
  symbol: Type.String,
  blockchainAddress: Type.String
}) {}

export class Task extends Entity.Class<Task>('Task')({
  description: Type.String,
  name: Type.String,
  status: Type.Boolean
}) {}