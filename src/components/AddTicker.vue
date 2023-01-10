<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Ticker</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="handleAdd"
            @input="handleMatch"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="e.g. BTC"
          />
        </div>

        <template v-if="matches.length > 0">
          <div class="flex bg-white shadow-md p-1 rounded-md flex-wrap">
            <span
              v-for="(t, idx) in matches"
              @click="handleAdd"
              :key="idx"
              class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            >
              {{ t }}
            </span>
          </div>
        </template>
        <div class="text-sm text-red-600" v-if="this.dangerMsg !== ''">
          {{ dangerMsg }}
        </div>
        <add-button @add-ticker="handleAdd" class="my-4" />
      </div>
    </div>
  </section>
</template>

<script>
import { getFullTickersList } from "../api";
import AddButton from "./AddButton.vue";

export default {
  name: "SectionAdd",
  components: {
    AddButton
  },
  data() {
    return {
      ticker: "",
      fullTickersList: [],
      matches: [],
      invalidMsg: ""
    };
  },
  props: {
    dangerMsg: { type: String }
  },
  async mounted() {
    this.fullTickersList = await getFullTickersList();
  },
  methods: {
    handleAdd() {
      const tickerName = this.ticker.toUpperCase();
      this.$emit("add-ticker", tickerName);
      this.ticker = "";
      this.matches = [];
    },

    handleMatch() {
      if (this.ticker === "") {
        this.matches = [];
        return;
      }

      const reg = new RegExp("^" + this.ticker.trim(), "i");
      this.matches = this.fullTickersList
        .filter((name) => reg.test(name))
        .sort()
        .slice(0, 4);
    }
  }
};
</script>
