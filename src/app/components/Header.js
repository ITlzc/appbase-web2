import '../styles/header.scss'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import {
    searchData
} from '../../lib/ton_supabase_api'

import { Spin } from 'antd';

export default function Header() {
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState('');
    const [apps, set_apps] = useState([]);
    const [search_input, set_search_input] = useState('');
    const [loading,set_loading] = useState(false)


    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    })

    const search = async (event) => {
        handleInputChange(event)
    }

    const deal_app = (app) => {
        if (app.icon) {
            app.show_icon = app.icon.url
            if (app.show_icon.indexOf('http') < 0) {
            app.show_icon = 'https://ton.app' + app.show_icon
            }
        }
    }

    const handleInputChange = debounce(async (event) => {
        console.log('search in = ', event)
        let input = event.target.value
        set_search_input(input)
        console.log('search = ', input, search_input)
        set_loading(true)
        let return_apps = await searchData(input)
        set_loading(false)
        return_apps.map(app => {
            deal_app(app)
        })
        console.log('search = ', return_apps)
        set_apps(return_apps)
    }, 300)

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


    return (
        <div className="header_ flex-row">
            <img
                className="image_1"
                src={"/images/logo.png"}
            />
            <div className={`text-wrapper_3 flex-col cursor-pointer ${currentPath === '/' || currentPath === '/explore_apps' ? 'active' : ''}`}>
                <Link href={'/'} className="text_6">Home</Link>
            </div>
            <div className={`text-wrapper_4 flex-col cursor-pointer ${(currentPath.includes('/explore') || currentPath.includes('/apps')) && currentPath !== '/explore_apps' ? 'active' : ''}`}>
                <Link href={'/explore/2'} className="text_7">Explore</Link>
            </div>
            <div className="box_3 flex-row">
                <input type="text" onChange={search} placeholder='Search Applications' />
                <img
                    className="label_1"
                    src={"/images/search.svg"}
                />
            </div>
            {
                search_input && search_input.length && <div className="box_11 flex-col">
                    <span className="text_20">Apps</span>
                    <Spin size="large" spinning={loading}></Spin>
                    {
                        apps && apps.length ? apps.map((app, index) => {
                            return (
                                <div className="section_1 flex-col" key={index} onClick={() => to_detail(app)}>
                                    <div className="box_12 flex-col">
                                        <div className="box_20 flex-row justify-between">
                                            <img
                                                className="image_6"
                                                src={app.show_icon}
                                            />
                                            <div className="text-wrapper_12 flex-col justify-between">
                                                <span className="text_21">{app.name}</span>
                                                <span className="text_22">{app.caption}</span>
                                            </div>
                                        </div>
                                        <div className="box_21 flex-row justify-between">
                                            <span className="text_23">+{app.points / 1000000}&nbsp;points</span>
                                            <div className="text-wrapper_7 flex-col align-center justify-center cursor-pointer" onClick={() => to_detail(app)}>
                                                <span className="text_24">OPEN</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className='no-data flex-col align-center justify-center'>
                                <img src="/images/notFound.png" alt="" />
                                <span className='text_25'>The app you are searching for was not found</span>
                            </div>
                        )
                    }
                </div>
            }

        </div>
    )
}