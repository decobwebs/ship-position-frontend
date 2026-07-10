<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase as string
const route = useRoute()
const name = computed(() => decodeURIComponent(route.params.name as string))

const { data, pending } = await useFetch<any>(() => `${base}/api/vessel?name=${encodeURIComponent(name.value)}`, {
  watch: [name],
})
</script>

<template>
  <div class="page">
    <NuxtLink to="/" class="back">← Back to dashboard</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1 class="text-2xl sm:text-4xl">{{ name }}</h1>
        <p class="sub">Voyage history — the vessel's story across daily snapshots.</p>
      </div>
    </header>

    <!-- Voyage summary card(s) -->
    <div class="voyage-cards">
      <template v-if="pending">
        <div class="voyage"><Skeleton :rows="4" /></div>
      </template>
      <template v-else>
        <VoyageCard v-for="(v, i) in data?.voyages" :key="i" :voyage="v" />
        <div v-if="!data?.voyages?.length" class="voyage">
          <EmptyState message="No voyage record found." />
        </div>
      </template>
    </div>

    <!-- Day-by-day timeline -->
    <DataCard title="Timeline" :count="data?.timeline?.length || 0">
      <Skeleton v-if="pending" :rows="5" />
      <div v-else class="timeline">
        <TimelineItem v-for="(t, i) in data?.timeline" :key="i" :entry="t" />
        <EmptyState v-if="!data?.timeline?.length" message="No snapshots for this vessel." />
      </div>
    </DataCard>

    <footer class="foot">Rebuilt from immutable daily snapshots · E-SEN links a vessel's visit across days.</footer>
  </div>
</template>
