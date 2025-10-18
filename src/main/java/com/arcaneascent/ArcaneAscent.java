package com.arcaneascent;

import com.arcaneascent.registry.AAItems;
import com.arcaneascent.registry.AABlocks;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(ArcaneAscent.MOD_ID)
public class ArcaneAscent {
    public static final String MOD_ID = "arcaneascent";

    public ArcaneAscent() {
        IEventBus modBus = FMLJavaModLoadingContext.get().getModEventBus();
        AABlocks.BLOCKS.register(modBus);
        AABlocks.BLOCK_ITEMS.register(modBus);
        AAItems.ITEMS.register(modBus);
    }
}
