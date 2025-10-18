package com.arcaneascent.content;

import com.arcaneascent.registry.AAItems;
import net.minecraft.core.BlockPos;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.phys.BlockHitResult;

public class WizardBlock extends Block {
    public WizardBlock(Properties properties) {
        super(properties);
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player, InteractionHand hand, BlockHitResult hit) {
        if (!level.isClientSide) {
            // Give the player a spell scroll (one-time logic can be added later)
            ItemStack scroll = new ItemStack(AAItems.SPELL_SCROLL.get());
            if (!player.addItem(scroll)) {
                player.drop(scroll, false);
            }
        }
        return InteractionResult.sidedSuccess(level.isClientSide);
    }
}
