package com.arcaneascent.mod.event;

import com.arcaneascent.mod.ArcaneAscent;
import com.arcaneascent.mod.capability.WizardLevel;
import com.arcaneascent.mod.capability.WizardLevelProvider;
import com.arcaneascent.mod.entity.WizardEntity;
import com.arcaneascent.mod.init.ModEntities;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.player.Player;
import net.minecraftforge.common.capabilities.RegisterCapabilitiesEvent;
import net.minecraftforge.event.AttachCapabilitiesEvent;
import net.minecraftforge.event.entity.EntityAttributeCreationEvent;
import net.minecraftforge.event.entity.player.PlayerEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

@Mod.EventBusSubscriber(modid = ArcaneAscent.MODID)
public class ModEvents {

    @SubscribeEvent
    public static void onAttachCapabilitiesPlayer(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof Player) {
            if (!event.getObject().getCapability(WizardLevelProvider.WIZARD_LEVEL).isPresent()) {
                event.addCapability(new ResourceLocation(ArcaneAscent.MODID, "wizard_level"), new WizardLevelProvider());
            }
        }
    }

    @SubscribeEvent
    public static void onPlayerCloned(PlayerEvent.Clone event) {
        if (event.isWasDeath()) {
            event.getOriginal().getCapability(WizardLevelProvider.WIZARD_LEVEL).ifPresent(oldStore -> {
                event.getEntity().getCapability(WizardLevelProvider.WIZARD_LEVEL).ifPresent(newStore -> {
                    newStore.copyFrom(oldStore);
                });
            });
        }
    }

    @Mod.EventBusSubscriber(modid = ArcaneAscent.MODID, bus = Mod.EventBusSubscriber.Bus.MOD)
    public static class ModEventBusEvents {

        @SubscribeEvent
        public static void registerCapabilities(RegisterCapabilitiesEvent event) {
            event.register(WizardLevel.class);
        }

        @SubscribeEvent
        public static void entityAttributeEvent(EntityAttributeCreationEvent event) {
            event.put(ModEntities.WIZARD.get(), WizardEntity.createAttributes().build());
        }
    }
}