class vi {
    save: string = 'cứu';
    confirm: string = 'xác nhận';
    cancel: string = 'Hủy bỏ';
    done: string = 'Hoàn thành';
    noData: string = 'Không có dữ liệu';
    placeholder: string = 'vui lòng nhập';
    select: string = 'xin vui lòng chọn';
    video = {
        errorTip: "Tải video không thành công",
        clickRetry: "Bấm để thử lại"
    };
    fixednav = {
        activeText: "Thu gọn điều hướng",
        unActiveText: "Điều hướng nhanh"
    };
    pagination = {
        prev: "Trang trước",
        next: "Trang tiếp theo"
    };
    calendaritem = {
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        end: "Hoàn thành",
        start: "bắt đầu",
        title: "lựa chọn ngày",
        monthTitle: (year: any, month: any) => `${year}/${month}`,
        today: "Hôm nay"
    };
    calendarcard = {
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        end: "Hoàn thành",
        start: "bắt đầu",
        title: "lựa chọn ngày",
        monthTitle: (year: any, month: any) => `${year}/${month}`,
        today: "Hôm nay"
    };
    shortpassword = {
        title: "Xin vui lòng nhập mật khẩu",
        desc: "Bạn đã sử dụng tài sản ảo, vui lòng xác minh",
        tips: "quên mật khẩu"
    };
    uploader = {
        ready: "Sẵn sàng hoàn thành",
        readyUpload: "sẵn sàng tải lên",
        waitingUpload: "Đang chờ tải lên",
        uploading: "đang tải lên",
        success: "Tải lên thành công",
        error: "Tải lên thất bại"
    };
    countdown = {
        day: "ngày",
        hour: "giờ",
        minute: "phút",
        second: "giây"
    };
    address = {
        selectRegion: "Vui lòng chọn khu vực của bạn",
        deliveryTo: "giao hàng tới",
        chooseAnotherAddress: "Chọn địa chỉ khác"
    };
    signature = {
        reSign: "Từ chức",
        unSupportTpl: "Rất tiếc, trình duyệt hiện tại không hỗ trợ Canvas và không thể sử dụng điều khiển này!"
    };
    ecard = {
        chooseText: "Vui lòng chọn mệnh giá của thẻ điện tử",
        otherValueText: "Các mệnh giá khác",
        placeholder: "Vui lòng nhập số nguyên từ 1-5000"
    };
    timeselect = {
        pickupTime: "Thời gian đón"
    };
    sku = {
        buyNow: "Mua nó ngay bây giờ",
        buyNumber: "Số lượng mua",
        addToCart: "thêm vào giỏ hàng"
    };
    skuheader = {
        skuId: "Số sản phẩm"
    };
    addresslist = {
        addAddress: "Địa chỉ mới",
        default: "mặc định"
    };
    comment = {
        complaintsText: "Tôi muốn khiếu nại",
        additionalReview: (day: any) => `Đánh giá sau khi mua ${day}`,
        additionalImages: (length: any) => `${length} hình ảnh đánh giá`
    };
    infiniteloading = {
        loading: "đang tải...",
        pullTxt: "Phát hành làm mới",
        loadMoreTxt: "Rất tiếc, đây là đáy"
    };
    datepicker = {
        year: "năm",
        month: "tháng",
        day: "ngày",
        hour: "giờ",
        min: "phút",
        seconds: "giây"
    };
    audiooperate = {
        back: "lùi lại",
        start: "bắt đầu",
        pause: "tạm ngừng",
        forward: "nhanh về phía trước",
        mute: "tắt tiếng"
    };
    pullrefresh = {
        pulling: "Kéo xuống để làm mới",
        loosing: "phát hành làm mới",
        loading: "đang tải...",
        complete: "Làm mới thành công"
    };
}

export default vi;