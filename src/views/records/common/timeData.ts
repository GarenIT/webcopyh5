

// 时间选项
export const timeOptoions = [
    { label: '昨天', value: -1 },
    { label: '今天', value: 1 },
    { label: '七天内', value: -7 },
]

// 日期转对象
export function convertDateToObject(date: Date): any {
    const d = new Date(date)
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1, // JavaScript 中的月份从 0 开始，因此需要加 1
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds()
    };
}

// 时间转换
export const getTimeObj = (key:any) => {
    // 获取当前时间
    const now = new Date();
       // 获取今天的 00:00:00 时间
       const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
       // 获取明天的 00:00:00 时间
       const tomorrowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
       // 获取昨天的 00:00:00 时间
       const yesterdayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
       // 获取7天前的 00:00:00 时间
       const day7Midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
    let arr = [todayMidnight, tomorrowMidnight]
    switch (key) {
        case -1:
            arr = [yesterdayMidnight, todayMidnight]
            break
        case -7:
            arr = [day7Midnight, tomorrowMidnight]
            break
    }
    return {
        start_time: convertDateToObject(arr[0]),
        end_time: convertDateToObject(arr[1]),
    }
}