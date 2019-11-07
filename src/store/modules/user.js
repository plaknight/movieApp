import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import loginApi from "@/api/login"
import myAuth from '@/utils/myAuth'
import route from "@/router"
//添加map映射表
import map from '@/utils/map'

console.log(1111112222)
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  routes: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTE(state,arr){
    state.routes = arr
  }
}

const actions = {
  //动态路由加载
  routerMounted({commit}) {
    const id = JSON.parse(window.localStorage.getItem("bufan")).user.id;
    console.log(id)
    loginApi.initLogin({id}).then(res=>{
      const routes = []
      res.data.forEach(el => {
        const tempObj = {
          path: el.url,
          name: el.name,
          component: map[el.component],
          redirect: el.redirect,
          meta: {
            title: el.title,
            icon: el.icon
          }
        }
        if (el.children.length !== 0) {
          tempObj.children = []
          el.children.forEach(item => {
            tempObj.children.push({
              path: item.url,
              name: item.name,
              component: map[item.component],
              meta: {
                title: item.title,
                icon: item.icon
              }
            })
          })
        }
        routes.push(tempObj)
      })
      console.log(routes)
      route.addRoutes(routes)
      commit("SET_ROUTE",routes)
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

