/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



function CustomVideoPlayer({ dHelper }) {
    const svgIcon = '<svg t="1647872796422" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2236" width="128" height="128"><path d="M179.796 369.171c-10.762 0-19.489 8.725-19.489 19.487 0 10.766 8.727 19.489 19.489 19.489 10.764 0 19.489-8.723 19.489-19.489 0-10.762-8.726-19.487-19.489-19.487z m769.18-57.106a19.409 19.409 0 0 0-19.888 0.743L705.996 460.173V349.68c0-43.053-34.904-77.953-77.955-77.953H140.818c-43.053 0-77.953 34.901-77.953 77.953v389.776c0 43.055 34.901 77.955 77.953 77.955H628.04c43.051 0 77.955-34.901 77.955-77.955v-93.93l222.94 149.59a19.454 19.454 0 0 0 19.964 0.877 19.47 19.47 0 0 0 10.239-17.15V329.174a19.473 19.473 0 0 0-10.162-17.109z m-281.96 180.688a19.547 19.547 0 0 0-0.4 3.903v112.063c0 1.321 0.14 2.624 0.4 3.894v126.845c0 21.527-17.452 38.98-38.976 38.98H140.818c-21.525 0-38.978-17.452-38.978-38.98V349.68c0-21.525 17.452-38.978 38.978-38.978H628.04c21.523 0 38.976 17.452 38.976 38.978v143.073z m253.146 249.929L705.996 598.48v-91.471l214.166-142.055v377.728z" p-id="2237"></path></svg>';

    return {
        config: {
            datas: [
            ],
            styles: [
                {
                    label: '视频',
                    key: 'video',
                    comType: 'group',
                    rows: [
                        {
                            label: 'video',
                            key: 'video',
                            default: 'https://www.w3school.com.cn/i/movie.ogg',
                            comType: 'input',
                            options: {
                                expand: true,
                                needRefresh: true,
                            },
                        },
                        {
                            label: 'volume',
                            key: 'volume',
                            default: 0.6,
                            comType: 'inputNumber',
                            options: {
                                step: 0.1,
                                min: 0,
                                max: 1,
                            },
                        },
                        {
                            label: 'plug',
                            key: 'plug',
                            comType: 'select',
                            default: '',
                            options: {
                                items: [
                                    { label: 'mp4', value: '' },
                                    { label: 'm3u8', value: 'hls.js' },
                                    { label: 'ts', value: 'mpegts.js' },
                                    { label: 'flv', value: 'flv.js' },
                                ],
                            },
                        },
                        {
                            label: 'rotate',
                            key: 'rotate',
                            default: 0,
                            comType: 'select',
                            options: {
                                items: [
                                    { label: '0°', value: 0 },
                                    { label: '90°', value: 90 },
                                    { label: '180°', value: 180 },
                                    { label: '270°', value: 270 },
                                ],
                            },
                        },
                        {
                            label: 'zoom',
                            key: 'zoom',
                            default: 100,
                            comType: 'select',
                            options: {
                                items: [
                                    { label: '100%', value: 100 },
                                    { label: '75%', value: 75 },
                                    { label: '50%', value: 50 },
                                ],
                            },
                        },
                        {
                            label: 'playbackrate',
                            key: 'playbackrate',
                            default: 1,
                            comType: 'inputNumber',
                            options: {
                                needRefresh: true,
                                step: 0.25,
                                min: 0.75,
                            },
                        },
                        
                        {
                            label: 'autoplay',
                            key: 'autoplay',
                            default: true,
                            comType: 'checkbox',
                        },
                        {
                            label: 'loop',
                            key: 'loop',
                            default: true,
                            comType: 'checkbox',
                        },
                        
                        {
                            label: 'live',
                            key: 'live',
                            default: false,
                            comType: 'checkbox',
                        },
                        {
                            label: 'controls',
                            key: 'controls',
                            default: true,
                            comType: 'checkbox',
                        },
                        {
                            label: 'rightBar',
                            key: 'rightBar',
                            default: false,
                            comType: 'checkbox',
                        },
                        {
                            label: 'smallWindows',
                            key: 'smallWindows',
                            default: false,
                            comType: 'checkbox',
                        },
                        {
                            label: 'smallWindowsDrag',
                            key: 'smallWindowsDrag',
                            default: false,
                            comType: 'checkbox',
                        },
                    ],
                },
            ],
            settings: [
            ],
            i18ns: [
                {
                    lang: 'zh-CN',
                    translation: {
                        smallWindowsDrag: '小窗是否可拖动',
                        smallWindows: '开启小窗模式',
                        rightBar: '右侧工具栏',
                        controls: '控制器',
                        live: '是否直播',
                        zoom: '缩放',
                        rotate: '旋转角度',
                        loop: '循环',
                        autoplay: '自动播放',
                        playbackrate: '默认倍速',
                        volume: '默认音量',
                        plug: '插件',
                        video: '视频地址',
                    },
                },
                {
                    lang: 'en-US',
                    translation: {
                        smallWindowsDrag: 'smallWindowsDrag',
                        smallWindows: 'smallWindows',
                        rightBar: 'rightBar',
                        controls: 'controls',
                        live: 'live',
                        zoom: 'zoom',
                        rotate: 'rotate',
                        loop: 'loop',
                        autoplay: 'autoplay',
                        playbackrate: 'playbackrate',
                        volume: 'volume',
                        plug: 'plug',
                        video: 'video src',
                    },
                },
            ],
        },
        isISOContainer: 'CustomVideoPlayer',
        dependency: [
            'https://www.ckplayer.com/public/static/ckplayer-x3/js/ckplayer.js',
            'https://www.ckplayer.com/public/static/ckplayer-x3/css/ckplayer.css',
            'https://www.ckplayer.com/public/static/ckplayer-x3/hls.js/hls.min.js',
            'https://www.ckplayer.com/public/static/ckplayer-x3/flv.js/flv.min.js',
        ],
        meta: {
            id: 'custom-video-player',
            name: 'CustomVideoPlayer',
            icon: svgIcon,
            maxFieldCount: 1,
            requirements: [
                {
                    group: 0,
                    aggregate: 0,
                },
            ],
        },



        onMount(options, context) {
            // ckplayer docs: https://www.ckplayer.com/manual/11.html#m44
            // 初始化
            const player = context.window.ckplayer
            this.videoOptions = {
                container: `#${options.containerId}`, //“#”代表容器的ID，“.”或“”代表容器的class
                video: 'https://www.w3school.com.cn/i/movie.ogg',//视频地址
                autoplay: true,
                volume: 0.6,//默认音量，范围0-1
                loop: true,//是否需要循环播放
                rotate: 0,//视频旋转角度
                zoom: 1,//默认缩放比例
                live: false,//是否是直播
                plug: '',//使用插件，目前支持hls.js:用于在pc端播放m3u8，flv.js:播放flv，mpegts.js：播放ts
                playbackrate: 1,//默认倍速
                ended: null,//结束显示的内容
                webFull: false,//是否启用页面全屏按钮，默认不启用
                theatre: null,//是否启用剧场模式按钮，默认不启用
                controls: false,//是否显示自带控制栏
                rightBar: null,//是否开启右边控制栏
                smallWindows: null,//是否启用小窗口模式
                smallWindowsDrag: true,//小窗口开启时是否可以拖动
                timeScheduleAdjust: 1,//是否可调节播放进度,0不启用，1是启用，2是只能前进（向右拖动），3是只能后退，4是只能前进但能回到第一次拖动时的位置，5是看过的地方可以随意拖动
                barHideTime: 1500,//控制栏隐藏时间
            }
            this.player = new player(this.videoOptions);//初始化播放器
            this.player.play(); 
        },

        onUpdated(props, context) {
            this.player.remove();
            const player = context.window.ckplayer;
            const styles = props.config.styles;
            const [
                video,
                volume,
                rotate,
                plug,
                smallWindowsDrag,
                smallWindows,
                rightBar,
                live,
                zoom,
                loop,
                autoplay,
                playbackrate,
                controls,
            ] = dHelper.getStyles(
                styles,
                ['video'],
                [
                    'video',
                    'volume',
                    'rotate',
                    'plug',
                    'smallWindowsDrag',
                    'smallWindows',
                    'rightBar',
                    'live',
                    'zoom',
                    'loop',
                    'autoplay',
                    'playbackrate',
                    'controls',
                ],
                );
            
            this.videoOptions = Object.assign(this.videoOptions, {
                video,
                rotate,
                plug,
                smallWindowsDrag,
                smallWindows,
                rightBar,
                live,
                zoom,
                loop,
                autoplay,
                playbackrate,
            });

            this.player = new player(this.videoOptions);// 大部分参数都是在初始化时生效, 所以这里再次初始化播放器
            this.player.volume(volume);
            this.player.bar(controls);
            this.player.play(); 
        },

        onUnMount() {
            this.player.remove();
        },

        onResize() {
        },
    };
}

