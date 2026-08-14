import { TavernInterior } from "./components/TavernInterior";
import { ShopInterior } from "./components/ShopInterior";
import { GuildInterior } from "./components/GuildInterior";
import { ManorInterior } from "./components/ManorInterior";
export const INTERIOR_REGISTRY = {
    "The Sleeping Giant Inn": { tier: "A", component: TavernInterior },
    "Grand Market Hall": { tier: "A", component: ShopInterior },
    "Grand Adventurer's Guildhall": { tier: "A", component: GuildInterior },
    "Royal Archives": { tier: "A", component: GuildInterior },
    "Master Alchemist Apothecary": { tier: "B", component: ShopInterior },
    "Arcane Enchantment Emporium": { tier: "B", component: ShopInterior },
    "Solaria Merchant Guild": { tier: "B", component: ShopInterior },
    "Master Jeweler & Gemcutter": { tier: "B", component: ShopInterior },
    "Royal Baker's Guild": { tier: "B", component: ShopInterior },
    "Mercenary Bounty Office": { tier: "B", component: GuildInterior },
    "Solaris Noble Manor": { tier: "B", component: ManorInterior },
    "Silvercrest Estate": { tier: "B", component: ManorInterior },
    "Grand Chancellor Manor": { tier: "B", component: ManorInterior }
};
//# sourceMappingURL=InteriorRegistry.js.map