import React, { Component } from 'react';
type Props = {};
import { Table, Button, Icon, Modal, Form, Input, InputNumber,Popconfirm } from 'antd'
const Search = Input.Search;
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {retrieveProducts,createProduct, updateProduct,deleteProduct} from '../actions/ProductActions'
import moment from 'moment'
class ProductPage extends Component<Props> {
    props: Props
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type:'edit',
            selected: {},
            name: ''
            // continue: false,
            // barkod: '',
            // editVisible:false,
        }
    }
    componentDidMount(){
        this.props.retrieveProducts(this.state.name);
    }
    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const dataToSend = {
                    barcode: values.barcode,
                    name: values.name,
                    description: values.description,
                    category: values.category,
                    purchasePrice: values.purchasePrice,
                    salePrice: values.salePrice
                }
                if(this.state.type === 'create'){
                    this.props.createProduct(dataToSend, this.state.name);
                }
                if(this.state.type === 'edit'){
                    dataToSend.id =this.state.selected.id;
                    this.props.updateProduct(dataToSend, this.state.name);
                }
                setTimeout(() => {
                    this.setState({
                        visible: false
                    })
                }, 1000);
                this.props.form.resetFields()
            }
        });

    }
    handleSearch =(value) =>{
        this.props.retrieveProducts(value);
    }
    onSearchChange = (e) =>{
        this.setState({
            name: e.target.value
        })
    }
    handleDelete = () =>{
        this.props.deleteProduct(this.state.selected.id, this.state.name)
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        })
    }
    handleModalOpen = (type) => {
        this.setState({
            visible: true,
            type,
        
        })
    }

    render() {
        const columns = [{
            title: 'Barkod',
            dataIndex: 'barcode',
            key: 'barcode',
        }, {
            title: 'Isim',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Kategori',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Alis Fiyati',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
        },
        {
            title: 'Satis Fiyati',
            dataIndex: 'salePrice',
            key: 'salePrice',
        },
        {
            title: 'Giris Tarihi',
            dataIndex: 'registerDate',
            key: 'registerDate',
            render: (text) => <div>{moment.unix(text).format('DD/MM/YYYY')}</div>
        },
        {
            title: 'Duzenle',
            render:() => <Button onClick={()=>this.handleModalOpen('edit')} style={{border:'0', background:'transparent'}}><Icon type="edit" /></Button>
        },
        {
            title: 'Sil',
            render:() =><Popconfirm placement="topLeft" title={'Silmek istediginizden emin misiniz?'} onConfirm={this.handleDelete} okText="Yes" cancelText="No"><Button style={{border:'0', background:'transparent'}}><Icon type="delete" /></Button></Popconfirm>
        },
    
    ]
        const { getFieldDecorator } = this.props.form;   
        const {selected,type} = this.state     
        return (
            <div>
                <div className='page-header' >
                    <div className='header-h'>Urunler</div>
                    <div style={{ display: 'flex' }}>
                        <Search
                            style={{ height: '32px', marginRight: '10px' }}
                            placeholder="Urun Ara"
                            onSearch={this.handleSearch}
                            onChange = {this.onSearchChange}
                        />
                        <Button onClick={()=>this.handleModalOpen('create')} >Yeni Urun Girisi<Icon type='plus' /></Button>

                    </div>
                </div>
                <div className='page-body'>
                    <Table 
                        dataSource={this.props.products} columns={columns} 
                        onRow={(record) => {
                            return {
                                onClick: () => this.setState({selected: record})
                            }
                        }}
                    
                    />
                </div>
                

                <Modal
                    title= {this.state.type === 'edit' ? 'Urun Duzenle': 'Yeni Urun'}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button onClick={this.handleCancel}>Iptal</Button>,
                        <Button type="primary" onClick={this.handleOk}>
                            Kaydet
                        </Button>,
                    ]}
                >
                    <Form className='stock-form'>
                        <FormItem
                            label="Barkod"
                            style={{ display: 'flex' }}
                        >
                            {getFieldDecorator('barcode', {
                                initialValue: type === 'edit' ? selected.barcode : this.state.barkod,
                                rules: [{
                                    required: false, message: 'Barkodu girin!'
                                }],
                            })(
                                <Input onChange={this.handleBarcode} />
                            )}
                        </FormItem>
                        <div>
                            <FormItem
                                label="Isim"
                                style={{ display: 'flex' }}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: type === 'edit' ? selected.name : '',
                                    rules: [{
                                        required: true, message: 'Isim girin!'
                                    }],
                                })(
                                    <Input />
                                )}

                            </FormItem>
                            <FormItem
                                label="Aciklama"
                                style={{ display: 'flex' }}
                            >
                                {getFieldDecorator('description', {
                                    initialValue: type === 'edit' ? selected.description : '',                                    
                                    rules: [{
                                        required: false
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Kategori"
                                style={{ display: 'flex' }}
                            >
                                {getFieldDecorator('category', {
                                    initialValue: type === 'edit' ? selected.category : '',                                    
                                    rules: [{
                                        required: false
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Alis Fiyati"
                                style={{ display: 'flex' }}
                            >
                                {getFieldDecorator('purchasePrice', {
                                    initialValue: type === 'edit' ? selected.purchasePrice : '',                                    
                                    rules: [{
                                        required: true, message: 'Alis fiyatini girin!'
                                    }],
                                })(
                                    <InputNumber min={0} formatter={value => `${value}₺`} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Satis Fiyati"
                                style={{ display: 'flex' }}
                            >
                                {getFieldDecorator('salePrice', {
                                    initialValue: type === 'edit' ? selected.salePrice : '',                                    
                                    rules: [{
                                        required: true, message: 'Satis fiyatini girin!'
                                    }],
                                })(
                                    <InputNumber min={0} formatter={value => `${value}₺`} />
                                )}
                            </FormItem>
                        </div>
                        
                    </Form>
                </Modal>
                
            </div>
        );
    }
}
function mapStateToProps({productReducer}) {
    const {products} = productReducer;
	return {
        products
    }
}

const ConnectedPage = connect (mapStateToProps,{retrieveProducts,createProduct,updateProduct,deleteProduct})(ProductPage);
const WrappedPage = Form.create()(ConnectedPage);
export { WrappedPage as ProductPage }