package com.arcaneascent.content;

import com.arcaneascent.capability.WizardLevel;
import net.minecraft.network.chat.Component;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;

public class SpellScrollItem extends Item {
    public SpellScrollItem(Properties properties) {
        super(properties);
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
        ItemStack stack = player.getItemInHand(hand);
        if (!level.isClientSide) {
            WizardLevel.get(player).ifPresent(cap -> {
                if (cap.getLevel() < 1) {
                    cap.setLevel(1);
                    player.sendSystemMessage(Component.translatable("message.arcaneascent.level1"));
                    stack.shrink(1);
                } else {
                    player.sendSystemMessage(Component.translatable("message.arcaneascent.already1"));
                }
            });
        }
        return InteractionResultHolder.sidedSuccess(stack, level.isClientSide);
    }
}
