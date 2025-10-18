package com.arcaneascent.registry;

import com.arcaneascent.ArcaneAscent;
import com.arcaneascent.content.SpellScrollItem;
import net.minecraft.world.item.Item;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class AAItems {
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, ArcaneAscent.MOD_ID);

    public static final RegistryObject<Item> SPELL_SCROLL = ITEMS.register("spell_scroll", () -> new SpellScrollItem(new Item.Properties().stacksTo(1)));
}
