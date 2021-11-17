import Vue from "vue";
import Vuex from "vuex";
import http from "@/util/http-common.js";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sidos: [{ value: null, text: "선택하세요." }],
    guguns: [{ value: null, text: "선택하세요." }],
    houses: [],
    house: null,
  },
  mutations: {
    SET_SIDO_LIST(state, sidos) {
      sidos.forEach((sido) => {
        // for문을 이용해 state의 sidos 의 내용을 바꿈
        state.sidos.push({ value: sido.sidoCode, text: sido.sidoName });
      });
    },
    SET_GUGUN_LIST(state, guguns) {
      guguns.forEach((gugun) => {
        state.guguns.push({ value: gugun.gugunCode, text: gugun.gugunName });
      });
    },
    CLEAR_SIDO_LIST(state) {
      state.sidos = [{ value: null, text: "선택하세요." }];
    },
    CLEAR_GUGUN_LIST(state) {
      state.guguns = [{ value: null, text: "선택하세요." }];
    },
    SET_HOUSE_LIST(state, houses) {
      state.houses = houses;
    },
    SET_DETAIL_HOUSE(state, house) {
      state.house = house;
    },
  },
  actions: {
    // 얘는 비동기처리만!!, mutation에게 데이터 변환요청
    getSido({ commit }) {
      http
        .get(`/map/sido`)
        .then((response) => {
          // console.log(data);
          commit("SET_SIDO_LIST", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getGugun({ commit }, sidoCode) {
      const params = { sido: sidoCode };
      http
        .get(`/map/gugun`, { params })
        .then((response) => {
          // console.log(commit, response);
          commit("SET_GUGUN_LIST", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getHouseList({ commit }, gugunCode) {
      const SERVICE_KEY = process.env.VUE_APP_APT_DEAL_API_KEY;
      // 보안때문에 .env.local에 키 지정하여 가ㅈ8ㅕ오기

      const SERVICE_URL =
        "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

      const params = {
        LAWD_CD: gugunCode,
        DEAL_YMD: "202110",
        serviceKey: decodeURIComponent(SERVICE_KEY),

        // 디폴트는 한페이지당 열개씩만 가져옴.. 여기서 페이징처리.. 또는 몇년도에 몇월꺼 select 하는 처리
      };
      http
        .get(SERVICE_URL, { params })
        .then((response) => {
          console.log(commit, response);
          commit("SET_HOUSE_LIST", response.data.response.body.items.item);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    detailHouse({ commit }, house) {
      // 나중에 house.일련번호를 이용하여 api 호출
      commit("SET_DETAIL_HOUSE", house);
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
