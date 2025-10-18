package com.arcaneascent.registry;

import com.arcaneascent.ArcaneAscent;
import com.arcaneascent.content.WizardBlock;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.MapColor;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class AABlocks {
    public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, ArcaneAscent.MOD_ID);
    public static final DeferredRegister<Item> BLOCK_ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, ArcaneAscent.MOD_ID);

    public static final RegistryObject<Block> WIZARD_BLOCK = BLOCKS.register("wizard_block",
            () -> new WizardBlock(BlockBehaviour.Properties.of().mapColor(MapColor.COLOR_PURPLE).strength(1.5F)));

    static {
        BLOCK_ITEMS.register("wizard_block", () -> new BlockItem(WIZARD_BLOCK.get(), new Item.Properties()));
    }
}
