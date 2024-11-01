"use client";

import '../../styles/appInfo.scss'
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  getApp
} from '../../../lib/ton_supabase_api'
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

import { Popover, Spin } from 'antd';



export default function AppInfo({ params }) {
  const unwrappedParams = use(params); // 解包 params
  const [appData, setAppData] = useState({});
  const id = unwrappedParams.id
  console.log('AppInfo id = ', id)

  const [platforms_map] = useState({
    "web": "Web",
    "ios": "IOS",
    "android": "Android",
    "tg_bot": "Telagram",
    // "tg_chat": "Telagram",
    // "tg_channel": "Telagram"
  })

  const [open_map] = useState({
    "web": "Web",
    "ios": "IOS",
    "android": "Android",
    "tg_bot": "Telagram-bot"
  })

  const [platforms] = useState(['Web',
    'Telagram',
    'IOS',
    'Android'])

  const [platforms_string, set_platforms_string] = useState('')

  const [office_links] = useState([
    'twitter',
    'inst',
    'youtube',
    'github',
    'web'
  ])

  const [office_links_icon_map] = useState({
    'twitter':'/images/twitter_icon.svg', 
    'inst':'/images/instagram_icon.svg', 
    'youtube':'/images/youtube_icon.svg', 
    'github':'/images/github_icon.svg', 
    'web':'/images/Web_icon.svg'
    })

  const [office_links_buttons, set_office_links_buttons] = useState([])

  const [telegrams, set_telegrams] = useState([])

  const [all_telegram] = useState([
    'tg_bot',
    'tg_chat',
    'tg_channel'
  ])

  const [loading, set_loading] = useState(false)

  const [open, setOpen] = useState(false);

  const [only_open, set_only_open] = useState(true)

  const [open_buttons, set_open_buttons] = useState([])

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const getLastPathSegment = (url) => {
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/'); // 根据斜杠分割路径
    const lastPathSegment = pathParts[pathParts.length - 1]; // 获取最后一部分
    return lastPathSegment;
  };

  const deal_app = (app) => {
    if (app && app.icon) {
      app.show_icon = app.icon.url
      if (app.show_icon.indexOf('http') < 0) {
        app.show_icon = 'https://ton.app' + app.show_icon
      }
    }

    let temp = []
    let open_buttons_temp = []
    let office_links_buttons_temp = []
    let telefram_link = []
    app && app.appPlatforms && Object.keys(app && app.appPlatforms).map(key => {
      console.log("key = ", key, platforms_map[key], platforms.indexOf(platforms_map[key]))
      if (platforms.indexOf(platforms_map[key]) > -1) {
        if (temp.indexOf(platforms_map[key]) < 0) {
          temp.push(platforms_map[key])
        }
      }

      if (open_map.hasOwnProperty(key)) {
        open_buttons_temp.push({
          link: app.appPlatforms[key],
          title: open_map[key]
        })
      }

      if (office_links.indexOf(key) > -1) {
        let title = ''
        if (key == 'github') {
          title = 'Github'
        } else if (key == 'web') {
          title = 'website'
        } else {
          title = getLastPathSegment(app.appPlatforms[key])
          if (!title.startsWith('@')) {
            title = '@' + title
          }
        }
        office_links_buttons_temp.push({
          icon: office_links_icon_map[key],
          link: app.appPlatforms[key],
          title: title
        })
      }

      if (all_telegram.indexOf(key) > -1) {
        let title = getLastPathSegment(app.appPlatforms[key])
        if (!title.startsWith('@')) {
          title = '@' + title
        }
        telefram_link.push({
          icon: '',
          link: app.appPlatforms[key],
          title: title
        })
      }
    })
    let temp_string = temp.join(',')
    set_platforms_string(temp_string)

    set_office_links_buttons(office_links_buttons_temp)

    set_telegrams(telefram_link)


    let flag = false
    set_open_buttons(open_buttons_temp)
    if (open_buttons_temp.length == 1) {
      flag = true
    } else if (open_buttons_temp.length > 1) {
      flag = false
    }
    if (app.link && app.link.length && app.link !== 'https://') {
      flag = true
    }
    console.log('deal_app flag = ', flag, open_buttons_temp, app.link)
    set_only_open(true)

  }


  const appInfo = async (app_id) => {
    set_loading(true)
    let app = await getApp(app_id)
    set_loading(false)
    console.log('appInfo = ', app)
    deal_app(app)
    setAppData(app)
  }

  const open_app = async (index) => {
    console.log('open_app in = ', index)
    let link = null
    // if (open_buttons.length == 1) {
    //   let item = open_buttons[0]
    //   link = item.link
    // } else if (open_buttons.length > 1) {
    //   let item = open_buttons[index]
    //   link = item.link
    // }
    if (appData.link && appData.link.length && appData.link !== 'https://') {
      link = appData.link
    }

    if (link) {
      window.open(link)
    }
  }

  const click_office = (office) => {
    window.open(office.link)
  }

  const open_platform_link = (link) => {
    console.log('open_platform_link in = ', link)
    window.open(link)
  }

  const init_data = async () => {
    appInfo(id)
  }

  useEffect(() => {
    console.log('useEffect in')
    init_data()
    console.log('useEffect out')
  }, [])

  return (
    <Spin size="large" spinning={loading}>
      <div className="appInfo flex-col">
        <div className="block_1 flex-row">
          <div className="block_2 flex-col">
            <Header />
            <div className="box_2 flex-row align-center">
              <Link href={"/"} className="text_4">Home</Link>
              <img
                className="thumbnail_1"
                src={"/images/arrow-right.png"}
              />
              {
                appData && appData.category && appData.category.title && appData.category.title.length &&
                <div className='flex-row align-center'>
                  <span className="text_5">{appData.category.title}</span>
                  <img
                    className="thumbnail_2"
                    src={"/images/arrow-right.png"}
                  />
                </div>
              }
              <span className="text_6">{appData.name}</span>
            </div>
            <div className="box_3_ flex-row">
              <img
                className="image_2"
                src={appData.show_icon}
              />
              <div className="text-wrapper_3 flex-col justify-between">
                <span className="text_7">{appData.name}</span>
                <span className="text_8">
                  {appData.caption}
                </span>
              </div>
              <div className="group_2 flex-col">
                <div className="box_4 flex-col">
                  <span className="text_9">+{appData.points ? appData.points / 1000000 : 0} points</span>
                  {
                    only_open ? <div className="text-wrapper_4 flex-col justify-center align-center cursor-pointer" onClick={() => open_app(-1)}>
                      <span className="text_10">OPEN</span>
                    </div> :
                      <Popover
                        content=
                        {
                          open_buttons.map((item, index) => {
                            console.log('item = ', item)
                            return (
                              <div>
                                <p className='cursor-pointer' onClick={() => open_app(index)} style={{ width: '10.21vw', padding: '0.2vw 0' }}>{item.title}</p>
                              </div>
                            )
                          })
                        }
                        title=""
                        trigger="click"
                        placement="bottom"
                        open={open}
                        onOpenChange={handleOpenChange}
                      >
                        <div className="text-wrapper_4 flex-col justify-center align-center cursor-pointer">
                          <span className="text_10">OPEN</span>
                        </div>
                      </Popover>
                  }
                </div>
              </div>
            </div>
            <span className="text_11">Application Preview</span>
            <div className="box_5 flex-row justify-between">
              <div className="image-wrapper_1 flex-row flex-wrap justify-start">
                {
                  appData && appData.images && appData.images.map((item, index) => {
                    let url = item.url
                    if (url.indexOf('http') < 0) {
                      url = 'https://ton.app' + url
                    }
                    return (
                      <img
                        key={index}
                        className="image_3-0"
                        src={url}
                      />
                    )
                  })
                }
              </div>
            </div>
            <div className="box_6 flex-row justify-between">
              <div className="section_2 flex-col">
                <span className="text_12">Application Description</span>
                <span className="text_13">
                  {appData.description}
                </span>
                <img
                  className="label_2"
                  src={"/images/arrow-bottom.png"}
                />
              </div>
              <div className="section_3 flex-col">
                <span className="text_14">The Developers</span>
                <div className="image-text_1 flex-row">
                  <img
                    className="label_3"
                    src={"/images/comp.png"}
                  />
                  <div className="text-group_1 flex-col justify-between">
                    <span className="text_15">Platforms</span>
                    <span className="text_16">{platforms_string} </span>
                  </div>
                </div>

                <div className="image-text_1 flex-row">
                  <img
                    className="label_3"
                    src={"/images/officeLink.png"}
                  />
                  <div className="text-group_1 flex-col justify-between">
                    <span className="text_15">Official links</span>
                    <div className="group_5 flex-row flex-wrap justify-start">
                      {
                        office_links_buttons.map((office, index) => {
                          return (
                            <div className="group_6 flex-row align-center justify-center" key={index}>
                              <div className="image-text_2 flex-row align-center justify-between" onClick={() => click_office(office)}>
                                {/* <div className="box_7 flex-col" /> */}
                                <img src={office.icon} alt="" />
                                <span className="text-group_2">{office.title}</span>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                <div className="image-text_1 flex-row">
                  <img
                    className="label_3"
                    src={"/images/tg.png"}
                  />
                  <div className="text-group_1 flex-col justify-between">
                    <span className="text_15">Telegram</span>
                    <div className="group_5 flex-row flex-wrap justify-start">
                      {
                        telegrams.map((tg, index) => {
                          return (
                            <div className="group_6 flex-row align-center justify-center" key={index}>
                              <div className="image-text_2 flex-row align-center justify-between" onClick={() => click_office(tg)}>
                                {/* <div className="box_7 flex-col" /> */}
                                <span className="text-group_2">{tg.title}</span>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                <div className="image-text_5 flex-row justify-between">
                  <img
                    className="label_6"
                    src={"/images/tip.png"}
                  />
                  <div className="text-group_5">
                    <span className="text_19">
                      AppBase is not responsible for any of the apps in the catalog. Using this app you take your own risks. Read our
                    </span>
                    <span className="text_20"> Disclaimer Terms</span>
                    <span className="text_21"> and</span>
                    <span className="text_22"> Privacy Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />

      </div>
    </Spin>
  );
}
