import { generateCapitalPopulation } from "../packages/shared/src/npc/populationGenerator";

const seed = "TEST_SEED_1";
const population1 = generateCapitalPopulation(seed);
const population2 = generateCapitalPopulation(seed);

const distCount: Record<string, number> = {};
population1.forEach((npc: any) => {
  distCount[npc.homeDistrict] = (distCount[npc.homeDistrict] || 0) + 1;
});

console.log(`Population 1 size: ${population1.length}`);
console.log(`Population 2 size: ${population2.length}`);
console.log(`Are identical? ${population1[10]?.name === population2[10]?.name}`);
console.table(distCount);

console.log(`Population 1 size: ${population1.length}`);
console.log(`Population 2 size: ${population2.length}`);
console.log(`Are identical? ${population1[10]?.name === population2[10]?.name}`);
console.table(distCount);
