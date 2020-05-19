/**
 * 首页
 */
import React from 'react';
import { Button, Form, Input, Layout, Table, Notification, Dialog } from 'element-react';
import './index.less';
import request from '../../services/request';

interface IForm {
    [index: string]: string;
    title: string;
    platform: string;
    version: string;
    clientid: string;
}
interface iState {
    model: any | null;
    total: number;
    list: any[];
    form: IForm;
    dialogVisible: boolean;
}

export default class extends React.Component<iReactRoute, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            model: null,
            total: 0,
            list: [],
            form: {
                title: '',
                platform: '',
                clientid: '',
                version: '',
            },
            dialogVisible: false,
        };
    }
    columns = [
        {
            label: '标题',
            prop: 'title',
            className: 'list_small',
        },
        {
            label: '平台',
            prop: 'platform',
            width: 100,
            className: 'list_small',
        },
        {
            label: '版本',
            prop: 'version',
            width: 100,
            className: 'list_small',
        },
        {
            label: '用户id',
            prop: 'clientid',
            width: 100,
            className: 'list_small',
        },
        {
            label: '时间',
            prop: 'time',
            width: 190,
            className: 'list_small',
        },
        {
            label: '操作',
            prop: 'address',
            width: 100,
            className: 'list_small',
            render: (row: any) => {
                return (
                    <Button onClick={() => this.goDetail(row)} plain={true} type="info" size="small">
                        查看
                    </Button>
                );
            },
        },
    ];
    render() {
        return (
            <div id="dash">
                <Layout.Row align="middle" className="top_box">
                    <Layout.Col span="24">
                        <Form inline={true} model={this.state.form}>
                            <Form.Item>
                                <Input value={this.state.form.title} placeholder="标题" onChange={this.onChange.bind(this, 'title')} />
                            </Form.Item>
                            <Form.Item>
                                <Input value={this.state.form.platform} placeholder="平台" onChange={this.onChange.bind(this, 'platform')} />
                            </Form.Item>
                            <Form.Item>
                                <Input value={this.state.form.version} placeholder="版本号" onChange={this.onChange.bind(this, 'version')} />
                            </Form.Item>
                            <Form.Item>
                                <Input value={this.state.form.clientid} placeholder="用户id" onChange={this.onChange.bind(this, 'clientid')} />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => this.searchData()} type="primary">
                                    查询
                                </Button>
                            </Form.Item>
                        </Form>
                    </Layout.Col>
                </Layout.Row>
                <div className="bundle_box">
                    <Table style={{ width: '100%' }} columns={this.columns} data={this.state.list} border={true} />
                </div>
                <div className="footer">
                    <Button type="primary" onClick={() => this.prePage()} size="mini">
                        上一页
                    </Button>
                    <Button type="primary" onClick={() => this.nextPage()} size="mini">
                        下一页
                    </Button>
                </div>
                <Dialog title="提示" size="small" visible={this.state.dialogVisible} onCancel={() => this.setState({ dialogVisible: false })}>
                    <Dialog.Body>
                        {!!this.state.model && (
                            <Form model={this.state.model}>
                                <Form.Item label="标题">{this.state.model.title}</Form.Item>
                                <Form.Item label="时间">{this.state.model.time}</Form.Item>
                                <Form.Item label="详情">{this.state.model.desc}</Form.Item>
                                <Form.Item label="平台">{this.state.model.platform}</Form.Item>
                                <Form.Item label="版本号">{this.state.model.version}</Form.Item>
                                <Form.Item label="用户id">{this.state.model.clientid}</Form.Item>
                                <Form.Item label="ip">{this.state.model.ip}</Form.Item>
                                <Form.Item label="url">{this.state.model.url}</Form.Item>
                                <Form.Item label="os">{this.state.model.os}</Form.Item>
                                <Form.Item label="userAgent">{this.state.model.userAgent}</Form.Item>
                                <Form.Item label="createTime">{this.state.model.createTime}</Form.Item>
                                <Form.Item label="meta">{this.state.model.meta}</Form.Item>
                            </Form>
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={() => this.setState({ dialogVisible: false })}>关闭</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
    componentDidMount() {
        this.getList(0);
    }
    onChange = (key: string, value: any) => {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value }),
        });
    };
    pageindex = 0;
    async getList(pageindex?: number) {
        try {
            if (pageindex) this.pageindex = pageindex;
            let data = await request.get('/logs', Object.assign({ start: this.pageindex }, this.state.form));
            this.setState({
                list: data,
            });
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message,
            });
        }
    }
    prePage() {
        this.pageindex--;
        if (this.pageindex < 0) this.pageindex = 0;
        this.getList();
    }
    nextPage() {
        this.pageindex++;
        this.getList();
    }
    async searchData() {
        this.getList(0);
    }
    goDetail = (data: any) => {
        this.setState({ model: data, dialogVisible: true });
    };
}
