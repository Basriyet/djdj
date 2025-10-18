package com.arcaneascent.mod.init;

import com.arcaneascent.mod.ArcaneAscent;
import com.arcaneascent.mod.entity.WizardEntity;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.MobCategory;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModEntities {
    public static final DeferredRegister<EntityType<?>> ENTITY_TYPES = 
        DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, ArcaneAscent.MODID);

    public static final RegistryObject<EntityType<WizardEntity>> WIZARD = ENTITY_TYPES.register("wizard",
        () -> EntityType.Builder.of(WizardEntity::new, MobCategory.CREATURE)
            .sized(0.6F, 1.95F)
            .build("wizard"));

    public static void register(IEventBus eventBus) {
        ENTITY_TYPES.register(eventBus);
    }
}