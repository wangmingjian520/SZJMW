/*
 * action 类型
 */

export const type = {
    SWITCH_MENU : 'SWITCH_MENU',
    ADD_USERID : 'ADD_USERID',
}

// 菜单点击切换，修改二级名称
export function switchMenu(menuName) {
    return {
        type:type.SWITCH_MENU,
        menuName
    }
}

// 保存当前登录用户信息
export function setUserInfo(userId){
    return {
        type:type.ADD_USERID,
        userId
    }
}