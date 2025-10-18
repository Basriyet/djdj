package com.arcaneascent.capability;

import net.minecraft.core.Direction;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.player.Player;
import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.CapabilityManager;
import net.minecraftforge.common.capabilities.ICapabilitySerializable;
import net.minecraftforge.common.capabilities.RegisterCapabilitiesEvent;
import net.minecraftforge.common.util.LazyOptional;
import net.minecraftforge.event.AttachCapabilitiesEvent;
import net.minecraftforge.event.entity.player.PlayerEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import com.arcaneascent.ArcaneAscent;

@Mod.EventBusSubscriber(modid = ArcaneAscent.MOD_ID, bus = Mod.EventBusSubscriber.Bus.FORGE)
public class WizardLevel {
    public static final ResourceLocation ID = new ResourceLocation(ArcaneAscent.MOD_ID, "wizard_level");

    public interface IWizardLevel {
        int getLevel();
        void setLevel(int level);
    }

    public static class WizardLevelImpl implements IWizardLevel {
        private int level;
        @Override
        public int getLevel() { return level; }
        @Override
        public void setLevel(int level) { this.level = Math.max(0, level); }
    }

    public static class Storage {
        public static CompoundTag write(IWizardLevel inst) {
            CompoundTag tag = new CompoundTag();
            tag.putInt("level", inst.getLevel());
            return tag;
        }
        public static void read(CompoundTag tag, IWizardLevel inst) {
            inst.setLevel(tag.getInt("level"));
        }
    }

    public static final Capability<IWizardLevel> WIZARD_LEVEL = CapabilityManager.get(new net.minecraftforge.common.capabilities.CapabilityToken<IWizardLevel>(){});

    public static class Provider implements ICapabilitySerializable<CompoundTag> {
        private final WizardLevelImpl backend = new WizardLevelImpl();
        private final LazyOptional<IWizardLevel> optional = LazyOptional.of(() -> backend);

        @Override
        public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
            return cap == WIZARD_LEVEL ? optional.cast() : LazyOptional.empty();
        }

        @Override
        public CompoundTag serializeNBT() { return Storage.write(backend); }
        @Override
        public void deserializeNBT(CompoundTag nbt) { Storage.read(nbt, backend); }
    }

    public static java.util.Optional<IWizardLevel> get(Player player) {
        return player.getCapability(WIZARD_LEVEL).resolve();
    }

    @SubscribeEvent
    public static void attachCaps(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof Player) {
            event.addCapability(ID, new Provider());
        }
    }

    @SubscribeEvent
    public static void clone(PlayerEvent.Clone event) {
        if (event.isWasDeath()) {
            Player oldP = event.getOriginal();
            Player newP = (Player) event.getEntity();
            get(oldP).ifPresent(oldCap -> get(newP).ifPresent(newCap -> newCap.setLevel(oldCap.getLevel())));
        }
    }
}

@Mod.EventBusSubscriber(modid = ArcaneAscent.MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
class WizardLevelModBusEvents {
    @SubscribeEvent
    public static void registerCaps(RegisterCapabilitiesEvent event) {
        event.register(WizardLevel.IWizardLevel.class);
    }
}
