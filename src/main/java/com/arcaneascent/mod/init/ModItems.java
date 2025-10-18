package com.arcaneascent.mod.init;

import com.arcaneascent.mod.ArcaneAscent;
import com.arcaneascent.mod.item.MagicScrollItem;
import net.minecraft.world.item.Item;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    public static final DeferredRegister<Item> ITEMS = 
        DeferredRegister.create(ForgeRegistries.ITEMS, ArcaneAscent.MODID);

    public static final RegistryObject<Item> MAGIC_SCROLL = ITEMS.register("magic_scroll",
        () -> new MagicScrollItem(new Item.Properties()));

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
    }
}