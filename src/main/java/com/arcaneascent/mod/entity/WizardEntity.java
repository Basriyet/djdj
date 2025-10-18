package com.arcaneascent.mod.entity;

import com.arcaneascent.mod.init.ModItems;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.ai.attributes.AttributeSupplier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.entity.ai.goal.FloatGoal;
import net.minecraft.world.entity.ai.goal.LookAtPlayerGoal;
import net.minecraft.world.entity.ai.goal.RandomLookAroundGoal;
import net.minecraft.world.entity.ai.goal.WaterAvoidingRandomStrollGoal;
import net.minecraft.world.entity.npc.AbstractVillager;
import net.minecraft.world.entity.npc.VillagerTrades;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.trading.MerchantOffer;
import net.minecraft.world.item.trading.MerchantOffers;
import net.minecraft.world.level.Level;
import org.jetbrains.annotations.Nullable;

public class WizardEntity extends AbstractVillager {
    public WizardEntity(EntityType<? extends AbstractVillager> entityType, Level level) {
        super(entityType, level);
    }

    @Override
    protected void registerGoals() {
        this.goalSelector.addGoal(0, new FloatGoal(this));
        this.goalSelector.addGoal(1, new WaterAvoidingRandomStrollGoal(this, 0.6D));
        this.goalSelector.addGoal(2, new LookAtPlayerGoal(this, Player.class, 6.0F));
        this.goalSelector.addGoal(3, new RandomLookAroundGoal(this));
    }

    public static AttributeSupplier.Builder createAttributes() {
        return AbstractVillager.createMobAttributes()
            .add(Attributes.MAX_HEALTH, 20.0D)
            .add(Attributes.MOVEMENT_SPEED, 0.5D);
    }

    @Override
    protected InteractionResult mobInteract(Player player, InteractionHand hand) {
        if (!this.level().isClientSide && hand == InteractionHand.MAIN_HAND) {
            this.setTradingPlayer(player);
            this.openTradingScreen(player, this.getDisplayName(), 1);
            return InteractionResult.SUCCESS;
        }
        return super.mobInteract(player, hand);
    }

    @Override
    protected void updateTrades() {
        VillagerTrades.ItemListing[] trades = new VillagerTrades.ItemListing[] {
            new BasicItemListing(new ItemStack(Items.EMERALD, 5), new ItemStack(ModItems.MAGIC_SCROLL.get()), 10, 5, 0.05f)
        };

        MerchantOffers merchantoffers = this.getOffers();
        this.addOffersFromItemListings(merchantoffers, trades, 2);
    }

    public static class BasicItemListing implements VillagerTrades.ItemListing {
        private final ItemStack price;
        private final ItemStack forSale;
        private final int maxTrades;
        private final int villagerXp;
        private final float priceMultiplier;

        public BasicItemListing(ItemStack price, ItemStack forSale, int maxTrades, int villagerXp, float priceMultiplier) {
            this.price = price;
            this.forSale = forSale;
            this.maxTrades = maxTrades;
            this.villagerXp = villagerXp;
            this.priceMultiplier = priceMultiplier;
        }

        @Nullable
        @Override
        public MerchantOffer getOffer(net.minecraft.world.entity.Entity entity, net.minecraft.util.RandomSource random) {
            return new MerchantOffer(price, forSale, maxTrades, villagerXp, priceMultiplier);
        }
    }
}