package com.arcaneascent.mod.block;

import com.arcaneascent.mod.entity.WizardEntity;
import com.arcaneascent.mod.init.ModEntities;
import net.minecraft.core.BlockPos;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.phys.BlockHitResult;

public class WizardTowerBlock extends Block {
    public WizardTowerBlock(Properties properties) {
        super(properties);
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player, InteractionHand hand, BlockHitResult hit) {
        if (!level.isClientSide()) {
            // Spawn a wizard entity near the tower when interacted with
            WizardEntity wizard = new WizardEntity(ModEntities.WIZARD.get(), level);
            wizard.setPos(pos.getX() + 0.5, pos.getY() + 1, pos.getZ() + 0.5);
            level.addFreshEntity(wizard);
        }
        return InteractionResult.SUCCESS;
    }
}