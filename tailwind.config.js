/** @type {import('tailwindcss').Config} */
module.exports = {
    // 指定要处理的文件
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./index.html",
    ],

    // 主题配置
    theme: {
        // 扩展现有主题
        extend: {
            // 自定义颜色
            colors: {
                primary: {
                    DEFAULT: '#3B82F6',
                    dark: '#2563EB',
                },
            },
            // 自定义字体
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            // 自定义间距
            spacing: {
                '128': '32rem',
            },
            // 自定义断点
            screens: {
                '3xl': '1600px',
            },
        },
    },

    // 插件配置
    plugins: [],
}
