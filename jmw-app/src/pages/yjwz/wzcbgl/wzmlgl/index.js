import React from 'react';
import { Card , Table } from  'antd';
import  './index.less'
export default class Wzmlgl extends React.Component{
    // componentDidCatch(){
    //     const dateSource = [
    //         {

    //         }
    //     ]
    // }

    render(){
        const colums = [
           {
               title:'id',
               dateIndex:'id'
            },
            {
                title:'用户名',
                dateIndex:'username'
             },
            {
                title:'用户名',
                dateIndex:'username'
            },
            {
                title:'用户名',
                dateIndex:'username'
            }
        ]
        return (
            <div>
                <Card title="">
                    <Table
                        columns={colums}
                    >

                    </Table>
                </Card>
            </div>
        );
    }
}