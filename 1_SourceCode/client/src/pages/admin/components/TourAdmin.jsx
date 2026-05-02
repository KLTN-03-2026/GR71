import { useState, useEffect } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
    Table,
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    message,
    Card,
    Tag,
    Space,
    Tooltip,
    DatePicker,
    Divider,
    Drawer,
    Upload,
    Typography,
    Badge,
    Avatar,
    Tabs,
    Empty,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    SaveOutlined,
    SearchOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
import { toast } from 'react-toastify';
import { requestGetAllCategory } from '../../../config/CategoryRequest';
import {
    requestCreateTour,
    requestGetAllTour,
    requestUpdateTour,
    requestUploadImagesTour,
    requestDeleteTour,
    requestGetAllTourByAdmin,
} from '../../../config/TourRequest';
import moment from 'moment';

const transportOptions = ['Xe bus', 'Máy bay', 'Tàu hoả', 'Tàu thuỷ', 'Xe limousine'];

function TourManager() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(null);

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllTourByAdmin();
            setData(res.metadata);
            setLoading(false);
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải dữ liệu tour');
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await requestGetAllCategory();
                setCategories(res.metadata);
            } catch (error) {
                message.error('Đã xảy ra lỗi khi tải danh mục');
            }
        };

        fetchCategory();
        fetchProduct();
    }, []);

    // Lọc dữ liệu theo từ khoá tìm kiếm và danh mục
    const filteredData = data.filter((item) => {
        const matchSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = categoryFilter ? item.category === categoryFilter : true;
        return matchSearch && matchCategory;
    });

    const handleDelete = async (key) => {
        try {
            setLoading(true);
            await requestDeleteTour(key);
            message.success('Đã xoá tour thành công!');
            fetchProduct();
        } catch (error) {
            message.error('Đã xảy ra lỗi khi xóa tour!');
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTour(null);
        form.resetFields();
        setFileList([]);
        setDescription('');
        // Reset form với giá trị mặc định
        form.setFieldsValue({
            transport: [],
            departureSchedules: [],
        });
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingTour(record);
        console.log('Editing record:', record);

        // Convert image URLs to fileList format for Upload component
        const imageFileList =
            record.images?.map((url, index) => {
                // Xử lý URL ảnh đúng cách
                let fullUrl = url;
                if (!url.startsWith('http')) {
                    // Nếu không phải URL đầy đủ, tạo URL từ base URL
                    fullUrl = `${import.meta.env.VITE_URL_IMAGE}/uploads/products/${url}`;
                }

                return {
                    uid: `-${index}`,
                    name: url, // Sử dụng tên file gốc
                    status: 'done',
                    url: fullUrl, // dùng cho hiển thị thumbnail
                    thumbUrl: fullUrl, // thêm dòng này để chắc chắn có preview
                    originalUrl: url, // Lưu URL gốc (tên file) để xử lý khi save
                };
            }) || [];

        console.log('Processed imageFileList:', imageFileList);
        setFileList(imageFileList);
        setDescription(record.description || '');

        // Process departure schedules for form
        const processedSchedules =
            record.departureSchedules?.map((schedule) => ({
                departureDate: schedule.departureDate ? moment(schedule.departureDate) : null,
                returnDate: schedule.returnDate ? moment(schedule.returnDate) : null,
                hotel_name: schedule.hotel?.name || '',
                hotel_stars: schedule.hotel?.stars || 0,
                price_adult: schedule.price?.adult || 0,
                price_child: schedule.price?.child || 0,
                price_baby: schedule.price?.baby || 0,
                seatsAvailable: schedule.seatsAvailable || 0,
                status: schedule.status || 'available',
            })) || [];

        // Set form values theo model mới
        form.setFieldsValue({
            title: record.title,
            destination: record.destination,
            category: record.category,
            transport: record.transport || [],
            departureSchedules: processedSchedules,
        });
        setIsModalOpen(true);
    };

    // Remove unused function for now since we don't have itinerary in the new model
    // const handleSaveItineraryDay = () => {
    //     // This function can be removed or updated based on new requirements
    // };

    const handleOk = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();

            // Xử lý ngày tháng
            const departureTime = values.departure_time ? values.departure_time.format('YYYY-MM-DD') : null;

            // Xử lý ảnh
            let dataImage = [];

            // Kiểm tra có file mới được upload không
            const newFiles = fileList.filter((file) => file.originFileObj && !file.url);
            const existingFiles = fileList.filter((file) => file.status === 'done' && (file.url || file.response));

            if (newFiles.length > 0) {
                // Có file mới, upload lên server
                const formData = new FormData();
                newFiles.forEach((file) => {
                    formData.append('image', file.originFileObj);
                });

                try {
                    const res = await requestUploadImagesTour(formData);
                    const newImageUrls = res.metadata || [];

                    // Lấy URL ảnh cũ từ response hoặc từ editingTour
                    const existingImageUrls = existingFiles
                        .map((file) => {
                            if (file.response && file.response.url) {
                                return file.response.url;
                            }
                            // Trích xuất tên file từ URL đầy đủ
                            if (file.url && file.url.includes('/uploads/products/')) {
                                return file.url.split('/uploads/products/')[1];
                            }
                            return file.url;
                        })
                        .filter(Boolean);

                    // Kết hợp ảnh cũ và ảnh mới
                    dataImage = [...existingImageUrls, ...newImageUrls];
                } catch (uploadError) {
                    console.error('Upload image error:', uploadError);
                    message.error('Lỗi khi tải ảnh lên!');
                    return;
                }
            } else {
                // Không có file mới, chỉ lấy ảnh từ fileList hiện tại
                if (fileList.length > 0) {
                    dataImage = fileList
                        .map((file) => {
                            if (file.response && file.response.url) {
                                return file.response.url;
                            }
                            // Trích xuất tên file từ URL đầy đủ
                            if (file.url && file.url.includes('/uploads/products/')) {
                                return file.url.split('/uploads/products/')[1];
                            }
                            return file.url;
                        })
                        .filter(Boolean);
                } else if (editingTour) {
                    // Trường hợp đang edit nhưng không có ảnh nào trong fileList
                    dataImage = editingTour.images || [];
                }
            }

            // Chuẩn bị dữ liệu tour theo model mới
            const tour = {
                title: values.title,
                destination: values.destination,
                description: description,
                category: values.category,
                images: dataImage,
                transport: values.transport || [],
                departureSchedules:
                    values.departureSchedules?.map((schedule) => ({
                        departureDate: schedule.departureDate
                            ? schedule.departureDate.format
                                ? schedule.departureDate.format('YYYY-MM-DD')
                                : new Date(schedule.departureDate).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0],
                        returnDate: schedule.returnDate
                            ? schedule.returnDate.format
                                ? schedule.returnDate.format('YYYY-MM-DD')
                                : new Date(schedule.returnDate).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0],
                        hotel: {
                            name: schedule.hotel_name || '',
                            stars: Number(schedule.hotel_stars) || 0,
                        },
                        price: {
                            adult: Number(schedule.price_adult) || 0,
                            child: Number(schedule.price_child) || 0,
                            baby: Number(schedule.price_baby) || 0,
                        },
                        seatsAvailable: Number(schedule.seatsAvailable) || 0,
                        status: schedule.status || 'available',
                    })) || [],
            };

            // Thực hiện create hoặc update
            if (editingTour) {
                await requestUpdateTour(editingTour._id, tour);
                message.success('Cập nhật tour thành công!');
            } else {
                await requestCreateTour(tour);
                message.success('Thêm tour thành công!');
            }

            // Refresh data và đóng modal
            await fetchProduct();
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setDescription('');
            setEditingTour(null);
        } catch (error) {
            console.error('Error in handleOk:', error);

            // Xử lý các loại lỗi khác nhau
            if (error.errorFields) {
                // Lỗi validation
                message.error('Vui lòng kiểm tra lại thông tin đã nhập!');
            } else if (error.message) {
                // Lỗi từ API
                message.error(error.message);
            } else {
                // Lỗi chung
                message.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        setDescription('');
        setEditingTour(null);
    };

    const handlePreview = async (file) => {
        let previewUrl = file.url || file.preview || file.thumbUrl;

        // Nếu có URL, hiển thị trong modal thay vì mở tab mới
        if (previewUrl) {
            setPreviewImage(previewUrl);
            setPreviewVisible(true);
            return;
        }

        // Nếu không có URL, tạo preview từ file object và hiển thị trong modal
        if (file.originFileObj) {
            previewUrl = await getBase64(file.originFileObj);
            setPreviewImage(previewUrl);
            setPreviewVisible(true);
        }
    };

    // Helper function để convert file thành base64
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </div>
    );

    const columns = [
        {
            title: 'Tour',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        shape="square"
                        size={64}
                        src={`${import.meta.env.VITE_URL_IMAGE}/uploads/products/${record.images?.[0]}`}
                        alt={text}
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <div className="font-medium text-blue-700">{text}</div>
                        <div className="text-xs text-gray-500">{record.destination}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Giá từ',
            key: 'price',
            render: (_, record) => {
                const minPrice =
                    record.departureSchedules?.length > 0
                        ? Math.min(...record.departureSchedules.map((s) => s.price?.adult || 0))
                        : 0;
                return (
                    <div>
                        <div className="font-medium text-green-600">{minPrice.toLocaleString()}đ</div>
                        <div className="text-xs text-gray-500">{record.departureSchedules?.length || 0} lịch trình</div>
                    </div>
                );
            },
            sorter: (a, b) => {
                const minPriceA =
                    a.departureSchedules?.length > 0
                        ? Math.min(...a.departureSchedules.map((s) => s.price?.adult || 0))
                        : 0;
                const minPriceB =
                    b.departureSchedules?.length > 0
                        ? Math.min(...b.departureSchedules.map((s) => s.price?.adult || 0))
                        : 0;
                return minPriceA - minPriceB;
            },
        },
        {
            title: 'Lịch khởi hành',
            key: 'departureSchedules',
            render: (_, record) => {
                const scheduleCount = record.departureSchedules?.length || 0;
                const nextDeparture = record.departureSchedules?.find(
                    (s) => new Date(s.departureDate) > new Date() && s.status === 'available',
                );

                return (
                    <div>
                        <div className="font-medium">{scheduleCount} lịch trình</div>
                        {nextDeparture && (
                            <div className="text-xs text-blue-600">
                                Gần nhất: {new Date(nextDeparture.departureDate).toLocaleDateString('vi-VN')}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => {
                const category = categories?.find((c) => c._id === cat);
                return category ? (
                    <Tag color="purple" className="px-3 py-1 rounded-full">
                        {category.categoryName}
                    </Tag>
                ) : null;
            },
            filters: categories.map((cat) => ({ text: cat.categoryName, value: cat._id })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => {
                const availableSchedules =
                    record.departureSchedules?.filter((s) => s.status === 'available').length || 0;
                const totalSchedules = record.departureSchedules?.length || 0;

                return (
                    <div>
                        <Badge
                            status={availableSchedules > 0 ? 'success' : 'default'}
                            text={availableSchedules > 0 ? 'Còn chỗ' : 'Hết chỗ'}
                        />
                        <div className="text-xs text-gray-500">
                            {availableSchedules}/{totalSchedules} lịch trình
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-green-500 hover:text-green-600 hover:bg-green-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title="Xoá tour này?"
                            description="Bạn chắc chắn muốn xoá tour này? Hành động này không thể hoàn tác."
                            onConfirm={() => handleDelete(record._id)}
                            okText="Xoá"
                            cancelText="Huỷ"
                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card className="shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <div className="mb-4 md:mb-0">
                        <Title level={4} className="!mb-1">
                            Quản lý tour
                        </Title>
                        <Text type="secondary">Quản lý tất cả các tour du lịch</Text>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Input
                            placeholder="Tìm kiếm tour..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-64"
                        />
                        <Select
                            placeholder="Lọc theo danh mục"
                            allowClear
                            style={{ width: 180 }}
                            onChange={(value) => setCategoryFilter(value)}
                            value={categoryFilter}
                        >
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.categoryName}
                                </Option>
                            ))}
                        </Select>
                        <Button icon={<ReloadOutlined />} onClick={fetchProduct} loading={loading} />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Thêm tour mới
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total) => `Tổng ${total} tour`,
                        }}
                        locale={{
                            emptyText: <Empty description="Không có dữ liệu" />,
                        }}
                    />
                </div>
            </Card>

            {/* Remove unused modals and drawers for now */}

            {/* Modal thêm/sửa tour */}
            <Modal
                title={<div className="text-lg">{editingTour ? 'Chỉnh sửa tour' : 'Thêm tour mới'}</div>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                okText={editingTour ? 'Cập nhật' : 'Thêm'}
                cancelText="Huỷ"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                    initialValues={{ transport: [], departureSchedules: [] }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Tên tour"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
                        >
                            <Input placeholder="VD: Tour Đà Nẵng 3 ngày 2 đêm" />
                        </Form.Item>

                        <Form.Item
                            label="Điểm đến"
                            name="destination"
                            rules={[{ required: true, message: 'Vui lòng nhập điểm đến!' }]}
                        >
                            <Input placeholder="VD: Đà Nẵng, Hội An" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Mô tả chi tiết" name="description">
                        <div style={{ marginBottom: '60px' }}>
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                style={{ height: '200px' }}
                            />
                        </div>
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4 pt-10">
                        <Form.Item
                            label="Danh mục"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục tour">
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.categoryName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Phương tiện di chuyển" name="transport">
                            <Select mode="multiple" placeholder="Chọn phương tiện">
                                {transportOptions.map((t) => (
                                    <Option key={t} value={t}>
                                        {t}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    {/* Replace the text input for images with Upload component */}
                    <Form.Item label="Ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal
                            open={previewVisible}
                            title="Xem trước ảnh"
                            footer={null}
                            onCancel={() => setPreviewVisible(false)}
                        >
                            <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Form.Item>

                    {/* Lịch khởi hành */}
                    <Divider orientation="left">Lịch khởi hành</Divider>

                    <Form.List name="departureSchedules">
                        {(fields, { add, remove }) => (
                            <div className="space-y-4">
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        className="bg-gray-50"
                                        extra={
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                            />
                                        }
                                        title={`Lịch trình ${name + 1}`}
                                        size="small"
                                    >
                                        {/* Ngày đi và về */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Form.Item
                                                {...restField}
                                                label="Ngày khởi hành"
                                                name={[name, 'departureDate']}
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày khởi hành!' }]}
                                            >
                                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label="Ngày về"
                                                name={[name, 'returnDate']}
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày về!' }]}
                                            >
                                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                            </Form.Item>
                                        </div>

                                        {/* Khách sạn */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Form.Item {...restField} label="Tên khách sạn" name={[name, 'hotel_name']}>
                                                <Input placeholder="Tên khách sạn" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label="Số sao khách sạn"
                                                name={[name, 'hotel_stars']}
                                            >
                                                <InputNumber min={1} max={5} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </div>

                                        {/* Giá tour */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <Form.Item
                                                {...restField}
                                                label="Giá người lớn"
                                                name={[name, 'price_adult']}
                                                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                    addonAfter="đ"
                                                />
                                            </Form.Item>

                                            <Form.Item {...restField} label="Giá trẻ em" name={[name, 'price_child']}>
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                    addonAfter="đ"
                                                />
                                            </Form.Item>

                                            <Form.Item {...restField} label="Giá em bé" name={[name, 'price_baby']}>
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                    addonAfter="đ"
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* Số chỗ và trạng thái */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Form.Item
                                                {...restField}
                                                label="Số chỗ còn lại"
                                                name={[name, 'seatsAvailable']}
                                                rules={[{ required: true, message: 'Vui lòng nhập số chỗ!' }]}
                                            >
                                                <InputNumber min={0} style={{ width: '100%' }} />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label="Trạng thái"
                                                name={[name, 'status']}
                                                initialValue="available"
                                            >
                                                <Select>
                                                    <Option value="available">Còn chỗ</Option>
                                                    <Option value="soldout">Hết chỗ</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusCircleOutlined />}
                                        className="mt-2"
                                    >
                                        Thêm lịch khởi hành
                                    </Button>
                                </Form.Item>
                            </div>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
}

export default TourManager;
