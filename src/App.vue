<template>
  <div id="app">
    <div class="container mx-auto flex flex-col items-center p-4">
      <div class="container">
        <div class="w-full my-4"></div>
        <section>
          <div class="flex">
            <div class="max-w-xs">
              <label
                for="wallet"
                class="block text-sm font-medium text-gray-700"
                >Ticker</label
              >
              <div class="mt-1 relative rounded-md shadow-md">
                <input
                  v-model="ticker"
                  @keydown.enter="handleAdd()"
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
                    @click="handleAdd(t)"
                    :key="idx"
                    class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                  >
                    {{ t }}
                  </span>
                </div>
              </template>
              <div class="text-sm text-red-600" v-if="this.isExisting">
                The ticker you selected is already in the list
              </div>
            </div>
          </div>
          <button
            @click="handleAdd"
            type="button"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              class="-ml-0.5 mr-2 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="#ffffff"
            >
              <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              ></path>
            </svg>
            Add
          </button>
        </section>
        <hr class="w-full border-t border-gray-600 my-4" />
        <template v-if="tickers.length">
          <div class="flex justify-between items-center">
            <div>
              <button
                @click="page -= 1"
                :disabled="page <= 1"
                class="py-2 mr-4 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-gray-800 bg-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-40"
              >
                Aft
              </button>
              <button
                @click="page += 1"
                :disabled="!hasNextPage"
                class="py-2 mr-4 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-gray-800 bg-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-40"
              >
                Fwd
              </button>
            </div>
            <label>
              Filter:
              <input
                v-model="filter"
                type="text"
                class="border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md ml-2"
              />
            </label>
          </div>
          <hr class="w-full border-t border-gray-600 my-4" />
          <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div
              v-for="(t, idx) in paginatedTickers"
              :key="idx"
              @click="handleSelect(t)"
              :class="{
                'border-purple-800': selectedTicker === t
              }"
              class="bg-white overflow-hidden shadow rounded-lg border-4 border-transparent border-solid cursor-pointer transition-all flex-col h-full"
            >
              <div class="px-4 py-5 sm:p-6 text-center">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ t.name }} - USD
                </dt>
                <dd
                  class="mt-1 text-3xl font-semibold text-gray-900"
                  v-if="t.price"
                >
                  {{ t.price }}
                </dd>
                <dd class="mt-1 text-3xl font-semibold text-gray-900" v-else>
                  -
                </dd>
              </div>
              <div class="w-full border-t border-gray-200"></div>
              <button
                @click.stop="handleRemove(t)"
                class="flex items-center justify-center self-end font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-black hover:bg-gray-200 transition-all focus:outline-none"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Remove
              </button>
            </div>
          </dl>
          <hr class="w-full border-t border-gray-600 my-4" />
        </template>
        <section v-if="selectedTicker" class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ selectedTicker.name }} - USD
          </h3>
          <div v-if="error">
            {{ error }}
          </div>
          <div class="sm:flex sm:space-x-4" v-else>
            <div
              v-for="(stat, idx) in selectedTickerTradingInfo"
              :key="idx"
              class="inline-block bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-1 w-full sm:w-1/3 sm:my-8"
            >
              <div class="bg-white p-5">
                <div class="sm:flex sm:items-start">
                  <div
                    class="text-center sm:mt-0 sm:ml-2 sm:text-left uppercase"
                  >
                    <span class="text-sm font-medium text-gray-500 truncate">
                      {{ stat.title }}
                    </span>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ stat.price }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="selectedTicker = null"
            type="button"
            class="absolute top-0 right-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {
  subscribeToTicker,
  unsubscribeFromTicker,
  getTickerTradingInfo,
  getFullTickersList
} from "./api";

const tikersPerPage = 6;

export default {
  name: "App",
  data() {
    return {
      ticker: "",
      filter: "",

      tickers: [],
      selectedTicker: null,
      selectedTickerTradingInfo: null,
      matches: [],
      fullTickersList: [],
      isExisting: false,
      page: 1,

      error: ""
    };
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) this.filter = windowData.filter;
    if (windowData.page) this.page = windowData.page;

    const tickersData = localStorage.getItem("tickersList");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((t) =>
        subscribeToTicker(t.name, (newPrice) => {
          this.updateTicker(t.name, newPrice);
        })
      );
    }
  },
  async mounted() {
    this.fullTickersList = await getFullTickersList();
  },
  computed: {
    start() {
      return tikersPerPage * (this.page - 1);
    },
    end() {
      return tikersPerPage * this.page;
    },
    filteredTickers() {
      return this.tickers.filter((t) =>
        t.name.includes(this.filter.toUpperCase())
      );
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.start, this.end);
    },
    hasNextPage() {
      return this.filteredTickers.length / this.page > tikersPerPage
        ? true
        : false;
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },
  methods: {
    updateTicker(tickerName, price) {
      this.tickers.forEach((t) => {
        if (t.name === tickerName) {
          t.price = price;
        }
      });
    },
    handleAdd(t = this.ticker) {
      this.filter = "";
      this.validateInput();
      if (this.isExisting) return;
      const name = t.toUpperCase();

      if (!name) return;

      const currentTicker = {
        name,
        price: "-"
      };

      this.tickers = [...this.tickers, currentTicker];
      this.resetData();

      subscribeToTicker(name, (newPrice) => {
        this.updateTicker(name, newPrice);
      });
    },
    formatPrice(price) {
      if (price === "-") return price;
      // return price > 1 ? price.toFixed(2) : price.toPrecision(2);
      return price > 1
        ? price > 1000
          ? Math.abs(price) > 99999
            ? Math.sign(price) * (Math.abs(price) / 1000).toFixed(1) + "K"
            : Math.sign(price) * Math.abs(price)
          : price.toFixed(2)
        : price.toPrecision(2);
    },
    async handleRemove(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);

      if (this.selectedTicker === tickerToRemove) this.selectedTicker = null;
      unsubscribeFromTicker(tickerToRemove.name);
    },
    async handleSelect(ticker) {
      this.error = "";
      this.selectedTicker = ticker;

      try {
        const { VOLUME24HOURTO, OPEN24HOUR, LOW24HOUR, HIGH24HOUR } =
          await getTickerTradingInfo(ticker.name);

        const tickerTradingInfo = [
          { title: "Market Cap", price: VOLUME24HOURTO },
          { title: "Open 24h", price: OPEN24HOUR },
          { title: "Low 24h", price: LOW24HOUR },
          { title: "High 24h", price: HIGH24HOUR }
        ];

        this.selectedTickerTradingInfo = tickerTradingInfo.map((stat) => {
          const price = stat.price;
          return {
            ...stat,
            price: this.formatPrice(price)
          };
        });
      } catch (e) {
        this.error = "Something went wrong...";
      }
    },
    handleMatch() {
      if (this.ticker === "") {
        this.resetData();
        return;
      }
      const reg = new RegExp("^" + this.ticker.trim(), "i");
      this.matches = this.fullTickersList
        .filter((name) => reg.test(name))
        .sort()
        .slice(0, 4);
    },
    validateInput() {
      this.isExisting =
        this.tickers.filter(
          (ticker) => ticker.name === this.ticker.toUpperCase()
        ).length === 0
          ? false
          : true;
    },
    resetData() {
      this.ticker = "";
      this.matches = [];
      this.isExisting = false;
      this.matches = [];
    }
  },
  watch: {
    tickers() {
      localStorage.setItem("tickersList", JSON.stringify(this.tickers));
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    filter() {
      this.page = 1;
    },
    pageStateOptions(value) {
      const { pathname } = window.location;

      window.history.pushState(
        null,
        document.title,
        `${pathname}?filter=${value.filter}&page=${value.page}`
      );
    }
  }
};
</script>

<style scoped></style>
