
"use client";
import './styles/home.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getAnnouncement,
  getRewardCount,
  recentUpdate,
  recommandData,
  exploreAppData,
  getCategorys,
  searchData,
  getApp,
  getSlideshow
} from '../lib/ton_supabase_api'
import Header from './components/Header';
import Carousel from './components/Carousel';
import Footer from "./components/Footer";
import { Spin } from 'antd';


export default function Home() {

  const router = useRouter();

  const [appData, setAppData] = useState([]);
  const [loading, set_loading] = useState(false);

  const [reward, set_reward] = useState({});
  const [recent_apps, set_recent_apps] = useState([]);
  const [recommand_apps, set_recommand_apps] = useState([]);
  const [explore_apps, set_explore_apps] = useState([]);
  const [categorys, set_categorys] = useState([]);

  const [currentCategory, setCurrentCategory] = useState('All')



  const [page, set_page] = useState(1)
  const [size, set_size] = useState(6)

  const [recommand_page, set_recommand_page] = useState(1)
  const [recommand_size, set_recommand_size] = useState(3)


  const fetchReward = async () => {
    set_loading(true)
    let temp_reward = await getRewardCount()
    set_loading(false)
    console.log('fetchReward =', temp_reward)
    set_reward(temp_reward)
  }

  const deal_app = (app) => {
    if (app.icon) {
      app.show_icon = app.icon.url
      if (app.show_icon.indexOf('http') < 0) {
        app.show_icon = 'https://ton.app' + app.show_icon
      }
    }
  }

  const fetchRecentApps = async (page, size) => {
    set_loading(true)
    let new_apps = await recentUpdate(page, size)
    set_loading(false)
    console.log('fetchRecentApps =', new_apps)
    new_apps.map(app => {
      deal_app(app)
    })
    set_recent_apps(new_apps)
    console.log('fetchRecentApps recent_apps =', recent_apps)

  }

  const fetchRecommandApps = async (page, size) => {
    console.log('fetchRecommandApps in = ', page, size)
    set_loading(true)
    let apps = await recommandData(page, size)
    set_loading(false)
    console.log('fetchRecommandApps =', apps)
    if (apps && apps.length) {
      set_recommand_page(page)
    }
    apps.map(app => {
      deal_app(app)
    })
    set_recommand_apps(apps)
  }

  const fetchExploreApps = async (page, size, filter) => {
    set_loading(true)
    let apps = await exploreAppData(page, size, filter)
    set_loading(false)
    console.log('fetchExploreApps =', apps)
    apps.map(app => {
      deal_app(app)
    })
    set_explore_apps(apps)
  }

  const fetchCategorys = async () => {
    set_loading(true)
    let category = await getCategorys()
    set_loading(false)
    console.log('fetchCategorys =', category)
    set_categorys(category)
  }

  const to_mini_app = () => {
    router.push(`/explore_apps`);
  }

  const more_app = async (type) => {
    console.log('more_app in = ', type)
    router.push(`/explore/${type}`);
  }

  const to_detail = async (app) => {
    console.log('to_detail in = ', app)
    if (app.is_forward) {
      open_app(app)
      return
    }
    const app_id = app.id
    router.push(`/apps/${app_id}`);
  }

  const open_app = async (app) => {
    console.log('open_app in = ', app)
    if (app.link && app.link.length && app.link !== 'https://') {
      window.open(app.link)
    }
  }

  const switch_recommend = () => {
    console.log('switch_recommend in')
    let page = recommand_page + 1
    fetchRecommandApps(page, recommand_size)
  }

  const switch_category = (category) => {
    console.log('switch_category in', category)
    setCurrentCategory(category.name)
    set_page(1)
    fetchExploreApps(page, size, {
      category_id: category && category.category_id && category.category_id.length ? category.category_id : null
    })
  }

  const init_data = async () => {
    fetchCategorys()
    fetchReward()
    fetchRecentApps()

    fetchRecommandApps(recommand_page, recommand_size)

    fetchExploreApps(page, size)
  }
  useEffect(() => {
    console.log('useEffect in')
    init_data()
    console.log('useEffect out')
  }, [])

  return (
    <div>
      <Spin size="large" spinning={loading}>
        <div className="page flex-col">
          <div className="box_29 flex-row justify-between">
            <div className="block_11 flex-col">
              <span className="paragraph_1">
                Enjoy exciting app experiences
                <br />
                and generous rewards
              </span>
              <div className="text-wrapper_22 flex-row">
                <span className="text_1">Reward App</span>
                <span className="text_2">{reward.rewardAppCount}</span>
                <span className="text_3">Reward Tasks</span>
                <span className="text_4">{reward.rewardTaskCount}</span>
              </div>
              <div className="text-wrapper_2 flex-col cursor-pointer" onClick={to_mini_app}>
                <span className="text_5">Explore AppBase Miniapp</span>
              </div>
              <div className="box_1 flex-col">
                <Header />
                <div className="text-wrapper_23 flex-row">
                  <span className="text_9">Explore Apps</span>
                </div>
                {/* <div className="image-wrapper_1 flex-col"> */}
                <Carousel />
                {/* </div> */}
              </div>
              <div className="group_2 flex-col">
                <div className="section_7 flex-row justify-between">
                  <span className="text_10">Recent Updates</span>
                  <div className="image-wrapper_2 flex-col cursor-pointer" onClick={() => more_app(1)}>
                    <img
                      className="label_2"
                      src={"/images/more.svg"}
                    />
                  </div>
                </div>
                <div className="section_8 flex-row flex-wrap justify-between">
                  {
                    recent_apps.map(app => {
                      return (
                        <div key={app.id} className="block_3 flex-row cursor-pointer" onClick={() => to_detail(app)}>
                          <div className="image-text_12 flex-row justify-between">
                            <img
                              className="image_4"
                              src={app.show_icon}
                            />
                            <div className="text-group_17 flex-col justify-between">
                              <span className="text_11">{app.name}</span>
                              <span className="text_12">
                                {app.caption}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <img
              className="image_2"
              src={"/images/homeIcon.png"}
            />
          </div>
          <div className="box_31 flex-row justify-between">
            <div className="text-group_22 flex-col justify-between">
              <span className="text_21">Recommend</span>
              <span className="text_22">Open the Apps to receive rewards</span>
            </div>
            <div className="image-wrapper_3 flex-col cursor-pointer" onClick={() => switch_recommend()}>
              <img
                className="label_3"
                src={"/images/load.svg"}
              />
            </div>
          </div>
          <div className="box_32 flex-row justify-between">
            {
              recommand_apps.map(app => {
                return (
                  <div className="section_1 flex-col cursor-pointer" key={app.id} onClick={() => to_detail(app)}>
                    <div className="image-text_16 flex-row justify-between">
                      <img
                        className="image_9"
                        src={app.show_icon}
                      />
                      <div className="text-group_23 flex-col justify-between">
                        <span className="text_23">{app.name}</span>
                        <span className="text_24">{app.caption}</span>
                      </div>
                    </div>
                    <div className="block_12 flex-row justify-between">
                      <span className="text_25">+{app.points / 1000000} points</span>
                      <div className="text-wrapper_6 flex-col cursor-pointer" onClick={() => to_detail(app)}>
                        <span className="text_26">OPEN</span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="group_9 flex-col">
            <div className="text-group_26 flex-col justify-between">
              <span className="text_34">Explore Apps</span>
              <span className="text_35">Discover more applications and receive rewards</span>
            </div>
            <div className="group_23 flex-row justify-between">
              <div className='flex-row flex-wrap justify-start' style={{ width: '72.64vw' }}>
                {
                  categorys.map(cate => {
                    return (
                      <div key={cate.category_id} className={`group_10 flex-col justify-center ${cate.name === currentCategory ? 'category_active' : ''}`} onClick={() => switch_category(cate)}>
                        <div className="text-wrapper_9">
                          <span className="text_36">{cate.name}</span>
                          <span className="text_37"> </span>
                          <span className="text_38">{cate.count}</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>

              <div className="image-wrapper_4 flex-col cursor-pointer" onClick={() => more_app(2)}>
                <img
                  className="label_4"
                  src={"/images/more.svg"}
                />
              </div>
            </div>
            <div className="group_24 flex-row flex-wrap justify-between">
              {
                explore_apps.map(app => {
                  return (
                    <div className="box_8 flex-col cursor-pointer" key={app.id} onClick={() => to_detail(app)}>
                      <div className="block_13 flex-row justify-between">
                        <img
                          className="image_12"
                          src={app.show_icon}
                        />
                        <div className="text-wrapper_24 flex-col justify-between">
                          <span className="text_54">{app.name}</span>
                          <span className="text_55">{app.caption}</span>
                        </div>
                      </div>
                      <div className="block_14 flex-row justify-between">
                        <span className="text_56">+{app.points / 1000000} points</span>
                        <div className="text-wrapper_16 flex-col cursor-pointer" onClick={() => to_detail(app)}>
                          <span className="text_57">OPEN</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
            <Footer />
          </div>
        </div>
      </Spin>
    </div>
  );
}
