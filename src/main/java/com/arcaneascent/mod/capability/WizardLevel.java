package com.arcaneascent.mod.capability;

public class WizardLevel {
    private int level = 0;

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public void addLevel(int levels) {
        this.level += levels;
    }

    public boolean isWizard() {
        return level > 0;
    }

    public void copyFrom(WizardLevel source) {
        this.level = source.level;
    }

    public void saveNBTData(net.minecraft.nbt.CompoundTag nbt) {
        nbt.putInt("wizard_level", level);
    }

    public void loadNBTData(net.minecraft.nbt.CompoundTag nbt) {
        level = nbt.getInt("wizard_level");
    }
}