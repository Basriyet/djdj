package com.arcaneascent.mod.capability;

import net.minecraft.core.Direction;
import net.minecraft.nbt.CompoundTag;
import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.CapabilityManager;
import net.minecraftforge.common.capabilities.CapabilityToken;
import net.minecraftforge.common.capabilities.ICapabilityProvider;
import net.minecraftforge.common.util.INBTSerializable;
import net.minecraftforge.common.util.LazyOptional;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class WizardLevelProvider implements ICapabilityProvider, INBTSerializable<CompoundTag> {
    public static Capability<WizardLevel> WIZARD_LEVEL = CapabilityManager.get(new CapabilityToken<WizardLevel>() { });

    private WizardLevel wizardLevel = null;
    private final LazyOptional<WizardLevel> optional = LazyOptional.of(this::createWizardLevel);

    private WizardLevel createWizardLevel() {
        if (this.wizardLevel == null) {
            this.wizardLevel = new WizardLevel();
        }
        return this.wizardLevel;
    }

    @Override
    public @NotNull <T> LazyOptional<T> getCapability(@NotNull Capability<T> cap, @Nullable Direction side) {
        if (cap == WIZARD_LEVEL) {
            return optional.cast();
        }
        return LazyOptional.empty();
    }

    @Override
    public CompoundTag serializeNBT() {
        CompoundTag nbt = new CompoundTag();
        createWizardLevel().saveNBTData(nbt);
        return nbt;
    }

    @Override
    public void deserializeNBT(CompoundTag nbt) {
        createWizardLevel().loadNBTData(nbt);
    }
}