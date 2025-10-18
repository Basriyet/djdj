package com.arcaneascent.mod.item;

import com.arcaneascent.mod.capability.WizardLevelProvider;
import net.minecraft.ChatFormatting;
import net.minecraft.network.chat.Component;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;
import org.jetbrains.annotations.Nullable;

import java.util.List;

public class MagicScrollItem extends Item {
    public MagicScrollItem(Properties properties) {
        super(properties);
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
        ItemStack itemstack = player.getItemInHand(hand);
        
        if (!level.isClientSide()) {
            player.getCapability(WizardLevelProvider.WIZARD_LEVEL).ifPresent(wizardLevel -> {
                if (wizardLevel.getLevel() == 0) {
                    wizardLevel.setLevel(1);
                    player.sendSystemMessage(Component.literal("You have become a Level 1 Wizard!")
                        .withStyle(ChatFormatting.GOLD));
                    itemstack.shrink(1);
                } else {
                    player.sendSystemMessage(Component.literal("You are already a wizard!")
                        .withStyle(ChatFormatting.YELLOW));
                }
            });
        }
        
        return InteractionResultHolder.sidedSuccess(itemstack, level.isClientSide());
    }

    @Override
    public void appendHoverText(ItemStack stack, @Nullable Level level, List<Component> tooltip, TooltipFlag flag) {
        tooltip.add(Component.literal("Use this scroll to become a Level 1 Wizard")
            .withStyle(ChatFormatting.BLUE));
        super.appendHoverText(stack, level, tooltip, flag);
    }
}