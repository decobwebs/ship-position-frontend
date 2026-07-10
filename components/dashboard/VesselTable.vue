<script setup lang="ts">
type Column = { key: string; label: string; align?: 'right'; mono?: boolean }

const props = defineProps<{
  columns: Column[]
  rows: any[] | null | undefined
  primaryKey: string
  emptyMessage?: string
  rowKey?: (row: any, i: number) => string | number
}>()

const keyFor = (row: any, i: number) => (props.rowKey ? props.rowKey(row, i) : i)
const secondaryCols = (props.columns || []).filter((c) => c.key !== props.primaryKey)
</script>

<template>
  <div>
    <!-- table: tablet and up -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="text-left text-muted font-semibold text-[11.5px] uppercase tracking-wide px-3 py-2.5 border-b border-line"
              :class="{ 'text-right': col.align === 'right' }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="keyFor(row, i)">
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-3 border-b border-line whitespace-nowrap"
              :class="[col.align === 'right' ? 'text-right' : '', col.mono ? 'font-mono text-[12.5px] tabular-nums' : '']"
            >
              <slot :name="`cell-${col.key}`" :row="row">{{ row[col.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!rows?.length" :message="emptyMessage" />
    </div>

    <!-- stacked cards: mobile -->
    <div class="sm:hidden flex flex-col gap-4">
      <div v-for="(row, i) in rows" :key="keyFor(row, i)" class="border-b border-line pb-4 last:border-0">
        <div class="font-bold text-base mb-2">
          <slot :name="`cell-${primaryKey}`" :row="row">{{ row[primaryKey] }}</slot>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13.5px]">
          <template v-for="col in secondaryCols" :key="col.key">
            <dt class="text-muted">{{ col.label }}</dt>
            <dd class="m-0" :class="col.mono ? 'font-mono text-[12.5px] tabular-nums' : ''">
              <slot :name="`cell-${col.key}`" :row="row">{{ row[col.key] }}</slot>
            </dd>
          </template>
        </div>
      </div>
      <EmptyState v-if="!rows?.length" :message="emptyMessage" />
    </div>
  </div>
</template>
