const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Topic = require('../models/Topic');
const Question = require('../models/Question');

const sampleTopicsWithQuestions = [
  {
    title: 'HTML5 & Cấu Trúc Web Cơ Bản',
    description: 'Kiểm tra kiến thức về các thẻ Semantic HTML5, cấu trúc trang web, biểu mẫu và đa phương tiện.',
    questions: [
      {
        question: 'HTML là viết tắt của cụm từ nào sau đây?',
        answers: [
          { key: 'A', text: 'HyperText Markup Language' },
          { key: 'B', text: 'Hyperlinks and Text Markup Language' },
          { key: 'C', text: 'Home Tool Markup Language' },
          { key: 'D', text: 'HighText Machine Language' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ ngữ nghĩa (Semantic Tag) nào trong HTML5 dùng để định nghĩa phần chân trang?',
        answers: [
          { key: 'A', text: '<bottom>' },
          { key: 'B', text: '<foot>' },
          { key: 'C', text: '<footer>' },
          { key: 'D', text: '<section-footer>' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Thuộc tính nào của thẻ <a> được dùng để mở liên kết trong một tab hoặc cửa sổ mới?',
        answers: [
          { key: 'A', text: 'target="_blank"' },
          { key: 'B', text: 'target="_new"' },
          { key: 'C', text: 'target="_self"' },
          { key: 'D', text: 'rel="newtab"' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ nào sau đây là thẻ tự đóng (Self-closing tag) trong HTML?',
        answers: [
          { key: 'A', text: '<p>' },
          { key: 'B', text: '<img>' },
          { key: 'C', text: '<div>' },
          { key: 'D', text: '<span>' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Đoạn mã khai báo <!DOCTYPE html> ở đầu file HTML có ý nghĩa gì?',
        answers: [
          { key: 'A', text: 'Khai báo tài liệu đang tuân theo chuẩn HTML5' },
          { key: 'B', text: 'Kết nối tài liệu với máy chủ web' },
          { key: 'C', text: 'Chỉ định ngôn ngữ lập trình của trang' },
          { key: 'D', text: 'Bảo mật mã nguồn HTML' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ HTML nào sau đây được dùng để tạo một danh sách có thứ tự (được đánh số 1, 2, 3...)?',
        answers: [
          { key: 'A', text: '<ul>' },
          { key: 'B', text: '<ol>' },
          { key: 'C', text: '<li>' },
          { key: 'D', text: '<dl>' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Thuộc tính "alt" trong thẻ <img> có tác dụng chính là gì?',
        answers: [
          { key: 'A', text: 'Hiển thị văn bản thay thế khi hình ảnh bị lỗi hoặc cho trình đọc màn hình (Screen Reader)' },
          { key: 'B', text: 'Tạo đường viền khung ảnh nghệ thuật' },
          { key: 'C', text: 'Tự động phóng to hình ảnh' },
          { key: 'D', text: 'Liên kết hình ảnh sang trang web khác' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ HTML5 nào cho phép nhúng tệp video trực tiếp vào trang web mà không cần Flash plugin?',
        answers: [
          { key: 'A', text: '<media>' },
          { key: 'B', text: '<movie>' },
          { key: 'C', text: '<video>' },
          { key: 'D', text: '<embed-video>' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Sự khác nhau giữa kiểu nhập <input type="checkbox"> và <input type="radio"> là gì?',
        answers: [
          { key: 'A', text: 'Checkbox cho phép chọn nhiều lựa chọn, Radio chỉ cho phép chọn 1 trong nhóm cùng name' },
          { key: 'B', text: 'Radio cho phép chọn nhiều, Checkbox chỉ chọn 1' },
          { key: 'C', text: 'Cả hai hoàn toàn giống nhau chỉ khác hình dáng' },
          { key: 'D', text: 'Radio không thể gửi dữ liệu lên server' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ <meta charset="UTF-8"> đặt trong phần <head> có vai trò gì?',
        answers: [
          { key: 'A', text: 'Quy định bảng mã ký tự hiển thị đúng tiếng Việt và hầu hết các ngôn ngữ thế giới' },
          { key: 'B', text: 'Tự động dịch trang web sang tiếng Anh' },
          { key: 'C', text: 'Tối ưu hóa công cụ tìm kiếm Google' },
          { key: 'D', text: 'Bảo mật mật khẩu người dùng' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'CSS3 & Bố Cục Giao Diện Hiện Đại',
    description: 'Kiến thức về CSS Box Model, Flexbox, CSS Grid, Responsive Design và hiệu ứng chuyển động.',
    questions: [
      {
        question: 'Thuộc tính box-sizing: border-box trong CSS có tác dụng gì?',
        answers: [
          { key: 'A', text: 'Bao gồm padding và border vào trong tổng chiều rộng/chiều cao của phần tử' },
          { key: 'B', text: 'Chỉ tính content và loại bỏ hoàn toàn padding' },
          { key: 'C', text: 'Tự động tăng gấp đôi border của phần tử' },
          { key: 'D', text: 'Làm mờ đường viền xung quanh hộp' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong CSS Flexbox, thuộc tính nào dùng để căn chỉnh các phần tử theo trục chính (Main Axis)?',
        answers: [
          { key: 'A', text: 'align-items' },
          { key: 'B', text: 'justify-content' },
          { key: 'C', text: 'align-content' },
          { key: 'D', text: 'flex-direction' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Đơn vị rem trong CSS được tính toán dựa trên kích thước font của phần tử nào?',
        answers: [
          { key: 'A', text: 'Phần tử cha trực tiếp (Parent element)' },
          { key: 'B', text: 'Phần tử gốc <html> (Root element)' },
          { key: 'C', text: 'Kích thước của màn hình thiết bị (Viewport)' },
          { key: 'D', text: 'Phần tử <body>' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Cú pháp Media Query nào dùng để áp dụng style cho màn hình có chiều rộng tối đa 768px?',
        answers: [
          { key: 'A', text: '@media (min-width: 768px)' },
          { key: 'B', text: '@media (max-width: 768px)' },
          { key: 'C', text: '@media screen and (width: 768px)' },
          { key: 'D', text: '@screen (device-width: 768px)' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Thuộc tính z-index trong CSS chỉ có hiệu lực khi phần tử có position là gì?',
        answers: [
          { key: 'A', text: 'position: static' },
          { key: 'B', text: 'Khác static (relative, absolute, fixed, sticky)' },
          { key: 'C', text: 'Bắt buộc phải là position: absolute' },
          { key: 'D', text: 'display: block' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Trong CSS Grid, thuộc tính nào được dùng để định nghĩa số lượng và kích thước các cột trong container?',
        answers: [
          { key: 'A', text: 'grid-template-columns' },
          { key: 'B', text: 'grid-columns-count' },
          { key: 'C', text: 'grid-auto-flow' },
          { key: 'D', text: 'grid-column-gap' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Pseudo-class nào trong CSS được kích hoạt khi người dùng di chuyển con trỏ chuột qua phần tử?',
        answers: [
          { key: 'A', text: ':focus' },
          { key: 'B', text: ':active' },
          { key: 'C', text: ':hover' },
          { key: 'D', text: ':visited' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'CSS Selector nào sau đây có độ ưu tiên (Specificity) cao nhất?',
        answers: [
          { key: 'A', text: 'Tag Selector (vd: p)' },
          { key: 'B', text: 'Class Selector (vd: .card)' },
          { key: 'C', text: 'ID Selector (vd: #header)' },
          { key: 'D', text: 'Universal Selector (*)' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Sự khác nhau cơ bản giữa "display: none" và "visibility: hidden" là gì?',
        answers: [
          { key: 'A', text: '"display: none" xóa phần tử khỏi layout, "visibility: hidden" ẩn đi nhưng vẫn giữ nguyên khoảng trống' },
          { key: 'B', text: '"visibility: hidden" xóa hoàn toàn khỏi DOM, "display: none" thì không' },
          { key: 'C', text: 'Cả hai đều giữ nguyên khoảng trống trên màn hình' },
          { key: 'D', text: 'Không có điểm khác biệt' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thuộc tính CSS nào cho phép tạo hiệu ứng chuyển đổi mượt mà giữa các trạng thái CSS?',
        answers: [
          { key: 'A', text: 'transform' },
          { key: 'B', text: 'transition' },
          { key: 'C', text: 'translate' },
          { key: 'D', text: 'filter' },
        ],
        correctAnswer: 'B',
      },
    ],
  },
  {
    title: 'JavaScript Core & ES6+ Nâng Cao',
    description: 'Thử thách về biến let/const, Closures, Event Loop, Promise, Async/Await và Array Methods.',
    questions: [
      {
        question: 'Sự khác biệt chính giữa toán tử "==" và "===" trong JavaScript là gì?',
        answers: [
          { key: 'A', text: '"==" so sánh cả giá trị và kiểu dữ liệu, "===" chỉ so sánh giá trị' },
          { key: 'B', text: '"===" so sánh nghiêm ngặt cả giá trị và kiểu dữ liệu mà không ép kiểu' },
          { key: 'C', text: 'Cả hai đều hoạt động hoàn toàn giống nhau' },
          { key: 'D', text: '"===" chỉ dùng được cho kiểu chuỗi (String)' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Phương thức mảng nào trả về một mảng mới với các phần tử đã được biến đổi qua callback?',
        answers: [
          { key: 'A', text: 'forEach()' },
          { key: 'B', text: 'map()' },
          { key: 'C', text: 'filter()' },
          { key: 'D', text: 'reduce()' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Khái niệm Closure trong JavaScript mô tả điều gì?',
        answers: [
          { key: 'A', text: 'Một hàm có thể truy cập các biến từ phạm vi bên ngoài (Lexical Scope) nơi nó được khai báo' },
          { key: 'B', text: 'Cách thức đóng ứng dụng trình duyệt' },
          { key: 'C', text: 'Khối lệnh try-catch bắt lỗi ngoại lệ' },
          { key: 'D', text: 'Hàm tự động gọi ngay sau khi định nghĩa (IIFE)' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Cơ chế nào của JavaScript chịu trách nhiệm xử lý các tác vụ bất đồng bộ (Asynchronous)?',
        answers: [
          { key: 'A', text: 'Garbage Collector' },
          { key: 'B', text: 'Event Loop & Call Stack' },
          { key: 'C', text: 'Compiler Engine' },
          { key: 'D', text: 'DOM Parser' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Phương thức Promise.all() sẽ trả về lỗi (Reject) khi nào?',
        answers: [
          { key: 'A', text: 'Khi tất cả các Promise bên trong đều bị lỗi' },
          { key: 'B', text: 'Ngay khi có ít nhất một Promise bên trong bị lỗi (Reject)' },
          { key: 'C', text: 'Không bao giờ báo lỗi, luôn trả về null' },
          { key: 'D', text: 'Chỉ báo lỗi sau khi chạy hết tất cả Promise' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Từ khóa "const" trong ES6 ngăn chặn hành vi nào sau đây?',
        answers: [
          { key: 'A', text: 'Tái gán lại giá trị mới cho định danh biến (Re-assignment)' },
          { key: 'B', text: 'Sửa đổi thuộc tính bên trong một Object đã khai báo bằng const' },
          { key: 'C', text: 'Thêm phần tử vào một mảng đã khai báo bằng const' },
          { key: 'D', text: 'Sử dụng biến trong các hàm lồng nhau' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Phương thức mảng nào tìm và trả về phần tử ĐẦU TIÊN thỏa mãn điều kiện kiểm tra?',
        answers: [
          { key: 'A', text: 'filter()' },
          { key: 'B', text: 'find()' },
          { key: 'C', text: 'some()' },
          { key: 'D', text: 'indexOf()' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Toán tử Spread (...) trong ES6 có công dụng chính là gì?',
        answers: [
          { key: 'A', text: 'Trải phẳng hoặc sao chép các phần tử của Array / Object' },
          { key: 'B', text: 'Tạo biểu thức điều kiện 3 ngôi' },
          { key: 'C', text: 'So sánh tuyệt đối giữa 3 biến' },
          { key: 'D', text: 'Chuyển đổi kiểu dữ liệu về chuỗi' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Biểu thức typeof null trong JavaScript trả về kết quả là gì?',
        answers: [
          { key: 'A', text: '"null"' },
          { key: 'B', text: '"undefined"' },
          { key: 'C', text: '"object"' },
          { key: 'D', text: '"number"' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Cú pháp async/await trong JavaScript hoạt động dựa trên nền tảng của đối tượng nào?',
        answers: [
          { key: 'A', text: 'XMLHttpRequest' },
          { key: 'B', text: 'Promise' },
          { key: 'C', text: 'Web Workers' },
          { key: 'D', text: 'Service Worker' },
        ],
        correctAnswer: 'B',
      },
    ],
  },
  {
    title: 'ReactJS & React Hooks Thực Chiến',
    description: 'Component Lifecycle, JSX, useState, useEffect, Custom Hooks và kiến trúc Single Page App.',
    questions: [
      {
        question: 'Mục đích chính của thuộc tính "key" khi render danh sách trong React là gì?',
        answers: [
          { key: 'A', text: 'Giúp React định danh phần tử duy nhất để tối ưu quá trình Virtual DOM Diffing/Reconciliation' },
          { key: 'B', text: 'Để tự động đánh số thứ tự hiển thị' },
          { key: 'C', text: 'Để áp dụng CSS style riêng biệt cho phần tử' },
          { key: 'D', text: 'Để mã hóa dữ liệu bảo mật trong component' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong useEffect Hook, hàm return bên trong callback có vai trò gì?',
        answers: [
          { key: 'A', text: 'Cleanup function (dọn dẹp tài nguyên khi unmount hoặc trước khi effect kế tiếp chạy)' },
          { key: 'B', text: 'Trả về dữ liệu cho component con' },
          { key: 'C', text: 'Bắt lỗi cú pháp trong component' },
          { key: 'D', text: 'Tự động render lại component' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Hook nào trong React được dùng để ghi nhớ (memoize) kết quả tính toán phức tạp tránh tính lại vô ích?',
        answers: [
          { key: 'A', text: 'useCallback' },
          { key: 'B', text: 'useMemo' },
          { key: 'C', text: 'useRef' },
          { key: 'D', text: 'useReducer' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Điều nào sau đây là ĐÚNG về luồng truyền dữ liệu (Data Flow) trong React?',
        answers: [
          { key: 'A', text: 'Hai chiều (Two-way data binding) tự động' },
          { key: 'B', text: 'Một chiều từ cha xuống con qua Props (One-way data flow)' },
          { key: 'C', text: 'Chỉ truyền dữ liệu qua Global Window Object' },
          { key: 'D', text: 'Con có thể trực tiếp sửa Props của cha' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'React Virtual DOM mang lại lợi ích lớn nhất nào?',
        answers: [
          { key: 'A', text: 'Giảm thiểu các thao tác trực tiếp lên Real DOM bằng cách tính toán thay đổi hiệu quả' },
          { key: 'B', text: 'Thay thế hoàn toàn mã HTML của trình duyệt' },
          { key: 'C', text: 'Tự động tăng tốc độ đường truyền mạng' },
          { key: 'D', text: 'Cho phép React chạy không cần JavaScript' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Hook nào trong React cho phép truy cập và tương tác trực tiếp với phần tử DOM thực tế?',
        answers: [
          { key: 'A', text: 'useRef' },
          { key: 'B', text: 'useState' },
          { key: 'C', text: 'useContext' },
          { key: 'D', text: 'useLayout' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Khi cập nhật State dựa trên giá trị State trước đó, cách viết nào là chuẩn xác và an toàn nhất?',
        answers: [
          { key: 'A', text: 'setCount(count + 1)' },
          { key: 'B', text: 'setCount((prev) => prev + 1)' },
          { key: 'C', text: 'count = count + 1' },
          { key: 'D', text: 'this.count++' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'JSX là viết tắt của cụm từ nào và nó là gì trong hệ sinh thái React?',
        answers: [
          { key: 'A', text: 'JavaScript XML - Cú pháp mở rộng cho phép viết mã giao diện tương tự HTML bên trong JS' },
          { key: 'B', text: 'Java Syntax Extension - Trình biên dịch mã Java sang React' },
          { key: 'C', text: 'JSON Server Extension - Giao thức trao đổi dữ liệu REST' },
          { key: 'D', text: 'JavaScript XHR - Thư viện gọi API thay thế Axios' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Để quản lý các State phức tạp với nhiều hành động chuyển trạng thái, Hook nào thích hợp hơn useState?',
        answers: [
          { key: 'A', text: 'useReducer' },
          { key: 'B', text: 'useMemo' },
          { key: 'C', text: 'useCallback' },
          { key: 'D', text: 'useImperativeHandle' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thẻ React Fragment (<React.Fragment> hoặc <></>) có tác dụng chính là gì?',
        answers: [
          { key: 'A', text: 'Bọc nhiều phần tử con mà không tạo thêm thẻ DOM thừa vào cây DOM' },
          { key: 'B', text: 'Tăng gấp đôi tốc độ tải hình ảnh' },
          { key: 'C', text: 'Tự động dịch mã sang TypeScript' },
          { key: 'D', text: 'Tạo hoạt ảnh chuyển động cho component' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'Node.js & Xây Dựng RESTful API',
    description: 'Kiến thức Express.js, Middleware, HTTP Status Codes, xử lý bất đồng bộ và Authentication.',
    questions: [
      {
        question: 'Trong Express.js, tham số "next" trong hàm middleware có vai trò gì?',
        answers: [
          { key: 'A', text: 'Chuyển quyền điều khiển sang middleware hoặc route handler tiếp theo' },
          { key: 'B', text: 'Khởi động lại server backend' },
          { key: 'C', text: 'Đóng kết nối cơ sở dữ liệu' },
          { key: 'D', text: 'Gửi response ngay lập tức về client' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Mã HTTP Status Code nào biểu thị "Lỗi không có quyền truy cập (Forbidden)"?',
        answers: [
          { key: 'A', text: '400 Bad Request' },
          { key: 'B', text: '401 Unauthorized' },
          { key: 'C', text: '403 Forbidden' },
          { key: 'D', text: '404 Not Found' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Cấu trúc của một chuỗi JSON Web Token (JWT) gồm bao nhiêu phần phân tách bởi dấu chấm (.)?',
        answers: [
          { key: 'A', text: '2 phần (Header, Payload)' },
          { key: 'B', text: '3 phần (Header, Payload, Signature)' },
          { key: 'C', text: '4 phần (Header, Body, Key, Signature)' },
          { key: 'D', text: '1 phần duy nhất đã mã hóa' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Để Express có thể đọc được dữ liệu JSON từ body của HTTP POST request, cần dùng middleware nào?',
        answers: [
          { key: 'A', text: 'express.static()' },
          { key: 'B', text: 'express.json()' },
          { key: 'C', text: 'express.urlencoded()' },
          { key: 'D', text: 'express.router()' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Mô hình non-blocking I/O của Node.js giúp ích gì cho hệ thống máy chủ?',
        answers: [
          { key: 'A', text: 'Xử lý đồng thời hàng nghìn kết nối mà không bị nghẽn chờ đợi I/O (File, Network, DB)' },
          { key: 'B', text: 'Tự động nhân bản mã nguồn sang nhiều máy chủ' },
          { key: 'C', text: 'Loại bỏ hoàn toàn bộ nhớ RAM khi chạy' },
          { key: 'D', text: 'Chỉ cho phép chạy 1 request duy nhất tại 1 thời điểm' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong ứng dụng Node.js, biến môi trường (Environment Variables) được đọc thông qua đối tượng nào?',
        answers: [
          { key: 'A', text: 'global.env' },
          { key: 'B', text: 'process.env' },
          { key: 'C', text: 'window.env' },
          { key: 'D', text: 'system.env' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Phương thức HTTP nào theo chuẩn thiết kế RESTful API được khuyến nghị cho thao tác cập nhật MỘT PHẦN tài nguyên?',
        answers: [
          { key: 'A', text: 'PUT' },
          { key: 'B', text: 'PATCH' },
          { key: 'C', text: 'POST' },
          { key: 'D', text: 'UPDATE' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Module có sẵn (Core Module) nào trong Node.js được dùng để tương tác với hệ thống tệp tin trên đĩa cứng?',
        answers: [
          { key: 'A', text: 'path' },
          { key: 'B', text: 'fs (File System)' },
          { key: 'C', text: 'http' },
          { key: 'D', text: 'os' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Tùy chọn cờ "-D" hoặc "--save-dev" khi cài đặt package bằng npm sẽ lưu gói vào đâu trong package.json?',
        answers: [
          { key: 'A', text: 'dependencies' },
          { key: 'B', text: 'devDependencies' },
          { key: 'C', text: 'peerDependencies' },
          { key: 'D', text: 'globalDependencies' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Thư viện nào phổ biến nhất trong hệ sinh thái Node.js dùng để băm (hash) mật khẩu một chiều an toàn?',
        answers: [
          { key: 'A', text: 'bcrypt / bcryptjs' },
          { key: 'B', text: 'jwt' },
          { key: 'C', text: 'dotenv' },
          { key: 'D', text: 'cors' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'Cơ Sở Dữ Liệu MongoDB & NoSQL',
    description: 'Kiến thức về cơ sở dữ liệu Document, Mongoose ODM, Schema, Indexing và truy vấn tối ưu.',
    questions: [
      {
        question: 'MongoDB lưu trữ dữ liệu dưới định dạng tài liệu nào?',
        answers: [
          { key: 'A', text: 'BSON (Binary JSON)' },
          { key: 'B', text: 'Bảng (Relational Table)' },
          { key: 'C', text: 'Tệp tin thuần văn bản TXT' },
          { key: 'D', text: 'XML Data' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Phương thức nào trong Mongoose dùng để liên kết và lấy thông tin chi tiết từ Document khác qua ObjectId?',
        answers: [
          { key: 'A', text: 'join()' },
          { key: 'B', text: 'populate()' },
          { key: 'C', text: 'merge()' },
          { key: 'D', text: 'lookupTable()' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Mục đích chính của việc tạo Index (Chỉ mục) trên các trường thường xuyên tìm kiếm trong MongoDB là gì?',
        answers: [
          { key: 'A', text: 'Tăng tốc độ truy vấn tìm kiếm dữ liệu' },
          { key: 'B', text: 'Tiết kiệm dung lượng lưu trữ trên đĩa cứng' },
          { key: 'C', text: 'Tự động sao lưu dữ liệu sang đám mây' },
          { key: 'D', text: 'Đổi tên các trường dữ liệu' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong MongoDB, trường khóa chính mặc định luôn được tự động tạo có tên là gì?',
        answers: [
          { key: 'A', text: 'id' },
          { key: 'B', text: '_id' },
          { key: 'C', text: 'primaryKey' },
          { key: 'D', text: 'uuid' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Phương thức nào trong Mongoose cập nhật một tài liệu và trả về chính tài liệu sau khi đã sửa?',
        answers: [
          { key: 'A', text: 'findByIdAndUpdate(id, data, { new: true })' },
          { key: 'B', text: 'updateOne(id, data)' },
          { key: 'C', text: 'save({ returnNew: true })' },
          { key: 'D', text: 'modify(id, data)' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong cơ sở dữ liệu MongoDB, một tập hợp chứa các Documents được gọi là gì?',
        answers: [
          { key: 'A', text: 'Table' },
          { key: 'B', text: 'Collection' },
          { key: 'C', text: 'Database Row' },
          { key: 'D', text: 'Record Set' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Toán tử truy vấn nào trong MongoDB dùng để tìm các giá trị lớn hơn một giá trị cho trước?',
        answers: [
          { key: 'A', text: '$lt' },
          { key: 'B', text: '$gt' },
          { key: 'C', text: '$eq' },
          { key: 'D', text: '$ne' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Tính năng Aggregation Pipeline trong MongoDB phục vụ mục đích gì?',
        answers: [
          { key: 'A', text: 'Thực hiện chuỗi các phép biến đổi, gom nhóm, thống kê và tính toán dữ liệu đa tầng' },
          { key: 'B', text: 'Gửi email hàng loạt cho người dùng' },
          { key: 'C', text: 'Mã hóa cơ sở dữ liệu khi máy chủ tắt' },
          { key: 'D', text: 'Khởi động lại cluster cơ sở dữ liệu' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Phương thức nào trong Mongoose được khuyến nghị để đếm số lượng tài liệu thỏa mãn điều kiện lọc?',
        answers: [
          { key: 'A', text: 'countDocuments()' },
          { key: 'B', text: 'length()' },
          { key: 'C', text: 'size()' },
          { key: 'D', text: 'total()' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Ưu điểm chính của thiết kế Embedded Document (nhúng tài liệu con) trong MongoDB là gì?',
        answers: [
          { key: 'A', text: 'Đọc dữ liệu nhanh chỉ với một truy vấn duy nhất mà không cần liên kết (Join/Populate)' },
          { key: 'B', text: 'Không giới hạn dung lượng tài liệu tối đa' },
          { key: 'C', text: 'Tự động tạo quan hệ nhiều-nhiều' },
          { key: 'D', text: 'Chuyển dữ liệu sang dạng bảng SQL' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'Kiến Thức Quản Lý Mã Nguồn Git & GitHub',
    description: 'Quy trình làm việc nhóm với Git, phân nhánh Branch, Commit, Rebase, Conflict và Remote.',
    questions: [
      {
        question: 'Lệnh Git nào được sử dụng để tải toàn bộ mã nguồn của một remote repository về máy tính?',
        answers: [
          { key: 'A', text: 'git clone <url>' },
          { key: 'B', text: 'git copy <url>' },
          { key: 'C', text: 'git download <url>' },
          { key: 'D', text: 'git fetch-all <url>' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Lệnh nào dùng để tạo và chuyển ngay sang một nhánh (branch) mới trong Git?',
        answers: [
          { key: 'A', text: 'git branch <branch-name>' },
          { key: 'B', text: 'git checkout -b <branch-name>' },
          { key: 'C', text: 'git merge <branch-name>' },
          { key: 'D', text: 'git commit -b <branch-name>' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Tập tin .gitignore trong Git có vai trò gì?',
        answers: [
          { key: 'A', text: 'Chỉ định các tệp hoặc thư mục mà Git không theo dõi (Untracked)' },
          { key: 'B', text: 'Xóa vĩnh viễn các file trên máy tính' },
          { key: 'C', text: 'Lưu trữ mật khẩu của tài khoản GitHub' },
          { key: 'D', text: 'Tự động commit code mỗi khi lưu file' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Sự khác nhau cơ bản giữa "git pull" và "git fetch" là gì?',
        answers: [
          { key: 'A', text: '"git pull" = "git fetch" + tự động gộp (merge) vào nhánh hiện tại' },
          { key: 'B', text: '"git fetch" sẽ ghi đè và xóa bỏ toàn bộ code local' },
          { key: 'C', text: 'Cả hai lệnh hoàn toàn giống nhau không có khác biệt' },
          { key: 'D', text: '"git pull" chỉ dùng khi tải commit đầu tiên' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Khi gặp xung đột mã nguồn (Git Conflict) trong lúc merge, bước xử lý chuẩn là gì?',
        answers: [
          { key: 'A', text: 'Xóa toàn bộ thư mục dự án và clone lại' },
          { key: 'B', text: 'Mở các file bị conflict, chỉnh sửa giữ lại code đúng, sau đó git add và commit' },
          { key: 'C', text: 'Chạy lệnh git reset --hard liên tục' },
          { key: 'D', text: 'Tắt máy tính và khởi động lại' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Lệnh nào dùng để kiểm tra trạng thái các file đang sửa đổi, staged hay untracked trong thư mục làm việc?',
        answers: [
          { key: 'A', text: 'git status' },
          { key: 'B', text: 'git check' },
          { key: 'C', text: 'git info' },
          { key: 'D', text: 'git diff-all' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Lệnh Git nào giúp lưu tạm thời (tạm cất) những thay đổi chưa commit để có một thư mục làm việc sạch sẽ?',
        answers: [
          { key: 'A', text: 'git stash' },
          { key: 'B', text: 'git hide' },
          { key: 'C', text: 'git pause' },
          { key: 'D', text: 'git clean -f' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Lệnh nào dùng để hiển thị danh sách các commit đã thực hiện trong lịch sử của nhánh?',
        answers: [
          { key: 'A', text: 'git log' },
          { key: 'B', text: 'git history' },
          { key: 'C', text: 'git commits' },
          { key: 'D', text: 'git show-all' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Để đưa tất cả các file đã thay đổi vào vùng chuẩn bị commit (Staging Area), ta sử dụng lệnh nào?',
        answers: [
          { key: 'A', text: 'git add .' },
          { key: 'B', text: 'git stage-all' },
          { key: 'C', text: 'git push .' },
          { key: 'D', text: 'git prepare' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Con trỏ HEAD trong Git trỏ tới đối tượng nào?',
        answers: [
          { key: 'A', text: 'Commit hoặc nhánh hiện tại đang được checkout và làm việc' },
          { key: 'B', text: 'Commit đầu tiên khi khởi tạo repo' },
          { key: 'C', text: 'Tài khoản chủ sở hữu repository' },
          { key: 'D', text: 'Nhánh master/main trên GitHub remote' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
  {
    title: 'Khoa Học Máy Tính & Cấu Trúc Dữ Liệu',
    description: 'Các khái niệm Array, Linked List, Stack, Queue, Hash Table và độ phức tạp thuật toán Big-O.',
    questions: [
      {
        question: 'Cấu trúc dữ liệu Ngăn xếp (Stack) hoạt động theo nguyên lý nào?',
        answers: [
          { key: 'A', text: 'FIFO (First In, First Out)' },
          { key: 'B', text: 'LIFO (Last In, First Out)' },
          { key: 'C', text: 'Random Access' },
          { key: 'D', text: 'Priority First' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Thuật toán tìm kiếm nhị phân (Binary Search) có độ phức tạp thời gian trung bình là bao nhiêu?',
        answers: [
          { key: 'A', text: 'O(1)' },
          { key: 'B', text: 'O(n)' },
          { key: 'C', text: 'O(log n)' },
          { key: 'D', text: 'O(n^2)' },
        ],
        correctAnswer: 'C',
      },
      {
        question: 'Cấu trúc dữ liệu Hàng đợi (Queue) hoạt động theo nguyên lý nào?',
        answers: [
          { key: 'A', text: 'FIFO (First In, First Out - Vào trước ra trước)' },
          { key: 'B', text: 'LIFO (Last In, First Out)' },
          { key: 'C', text: 'Không theo thứ tự nào' },
          { key: 'D', text: 'Vào sau ra trước' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thời gian truy xuất phần tử theo chỉ số (Index) trong mảng Array có độ phức tạp là gì?',
        answers: [
          { key: 'A', text: 'O(1) - Thời gian hằng số' },
          { key: 'B', text: 'O(n)' },
          { key: 'C', text: 'O(log n)' },
          { key: 'D', text: 'O(n log n)' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Trong đệ quy (Recursion), thành phần nào BẮT BUỘC phải có để tránh lỗi tràn ngăn xếp (Stack Overflow)?',
        answers: [
          { key: 'A', text: 'Vòng lặp for bên trong' },
          { key: 'B', text: 'Điều kiện dừng cơ sở (Base Case)' },
          { key: 'C', text: 'Biến toàn cục' },
          { key: 'D', text: 'Hàm callback bất đồng bộ' },
        ],
        correctAnswer: 'B',
      },
      {
        question: 'Cấu trúc dữ liệu Bảng băm (Hash Table) có độ phức tạp thời gian tìm kiếm trung bình là bao nhiêu?',
        answers: [
          { key: 'A', text: 'O(1)' },
          { key: 'B', text: 'O(n)' },
          { key: 'C', text: 'O(n^2)' },
          { key: 'D', text: 'O(log n)' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Mỗi phần tử (Node) trong Danh sách liên kết đơn (Singly Linked List) bao gồm những thành phần cơ bản nào?',
        answers: [
          { key: 'A', text: 'Giá trị dữ liệu (Data) và con trỏ trỏ tới Node tiếp theo (Next pointer)' },
          { key: 'B', text: 'Chỉ chứa dữ liệu dạng số nguyên' },
          { key: 'C', text: 'Hai con trỏ trỏ về trước và về sau' },
          { key: 'D', text: 'Mảng các chỉ số index' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Đặc điểm cơ bản của Cây nhị phân tìm kiếm (Binary Search Tree - BST) là gì?',
        answers: [
          { key: 'A', text: 'Mọi node con bên trái nhỏ hơn node cha, mọi node con bên phải lớn hơn node cha' },
          { key: 'B', text: 'Tất cả các node có cùng giá trị bằng nhau' },
          { key: 'C', text: 'Mỗi node có thể có vô số node con' },
          { key: 'D', text: 'Cây luôn luôn rỗng' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Thuật toán sắp xếp nào sau đây có độ phức tạp thời gian trung bình là O(n log n)?',
        answers: [
          { key: 'A', text: 'Merge Sort / Quick Sort' },
          { key: 'B', text: 'Bubble Sort (Sắp xếp nổi bọt)' },
          { key: 'C', text: 'Insertion Sort (Sắp xếp chèn)' },
          { key: 'D', text: 'Selection Sort (Sắp xếp chọn)' },
        ],
        correctAnswer: 'A',
      },
      {
        question: 'Độ phức tạp không gian (Space Complexity) của thuật toán đo lường yếu tố nào?',
        answers: [
          { key: 'A', text: 'Lượng bộ nhớ RAM bổ sung mà thuật toán cần sử dụng theo kích thước dữ liệu đầu vào' },
          { key: 'B', text: 'Dung lượng file mã nguồn tính bằng kilobyte' },
          { key: 'C', text: 'Tốc độ CPU của máy tính' },
          { key: 'D', text: 'Thời gian chạy bằng giây của thuật toán' },
        ],
        correctAnswer: 'A',
      },
    ],
  },
];

const User = require('../models/User');
const Submission = require('../models/Submission');
const SubmissionAnswer = require('../models/SubmissionAnswer');
const bcrypt = require('bcryptjs');

const testUsersData = [
  {
    fullname: 'Nguyễn Văn Test',
    email: 'test@gmail.com',
    gender: 'Nam',
    dob: new Date('2000-01-01'),
    role: 'USER',
    status: 'ACTIVE',
  },
  {
    fullname: 'Nguyễn Huy Hoàng',
    email: 'hoang.dev@gmail.com',
    gender: 'Nam',
    dob: new Date('2001-08-15'),
    role: 'USER',
    status: 'ACTIVE',
  },
  {
    fullname: 'Lê Minh Ánh',
    email: 'minhanh.tester@gmail.com',
    gender: 'Nữ',
    dob: new Date('2002-03-20'),
    role: 'USER',
    status: 'ACTIVE',
  },
  {
    fullname: 'Trần Đức Anh',
    email: 'ducanh.tech@gmail.com',
    gender: 'Nam',
    dob: new Date('2002-11-10'),
    role: 'USER',
    status: 'ACTIVE',
  },
  {
    fullname: 'Quản Trị Viên Hệ Thống',
    email: 'admin@gmail.com',
    gender: 'Nam',
    dob: new Date('1998-05-20'),
    role: 'ADMIN',
    status: 'ACTIVE',
  }
];

// Định nghĩa lịch sử làm bài thi chân thực theo từng mốc thời gian phát triển dự án
const testSubmissionsTimeline = [
  // 1. Nguyễn Văn Test (test@gmail.com)
  {
    userEmail: 'test@gmail.com',
    topicTitle: 'HTML5 & Cấu Trúc Web Cơ Bản',
    startedAt: '2025-08-25T14:10:00.000Z',
    submittedAt: '2025-08-25T14:14:32.000Z',
    targetScore: 9, // 9/10
  },
  {
    userEmail: 'test@gmail.com',
    topicTitle: 'CSS3 & Giao Diện Responsive',
    startedAt: '2025-11-20T09:15:00.000Z',
    submittedAt: '2025-11-20T09:21:40.000Z',
    targetScore: 8, // 8/10
  },
  {
    userEmail: 'test@gmail.com',
    topicTitle: 'JavaScript Core & ES6+ Nâng Cao',
    startedAt: '2026-01-20T16:40:00.000Z',
    submittedAt: '2026-01-20T16:46:15.000Z',
    targetScore: 7, // 7/10
  },
  {
    userEmail: 'test@gmail.com',
    topicTitle: 'ReactJS & Modern Frontend',
    startedAt: '2026-02-22T10:10:00.000Z',
    submittedAt: '2026-02-22T10:18:25.000Z',
    targetScore: 10, // 10/10
  },
  {
    userEmail: 'test@gmail.com',
    topicTitle: 'Node.js & RESTful API Backend',
    startedAt: '2026-05-15T14:30:00.000Z',
    submittedAt: '2026-05-15T14:37:45.000Z',
    targetScore: 8, // 8/10
  },

  // 2. Nguyễn Huy Hoàng (hoang.dev@gmail.com)
  {
    userEmail: 'hoang.dev@gmail.com',
    topicTitle: 'Git & GitHub Trong Dự Án Nhóm',
    startedAt: '2025-11-22T10:00:00.000Z',
    submittedAt: '2025-11-22T10:05:30.000Z',
    targetScore: 9, // 9/10
  },
  {
    userEmail: 'hoang.dev@gmail.com',
    topicTitle: 'Node.js & RESTful API Backend',
    startedAt: '2026-01-25T15:20:00.000Z',
    submittedAt: '2026-01-25T15:28:10.000Z',
    targetScore: 8, // 8/10
  },
  {
    userEmail: 'hoang.dev@gmail.com',
    topicTitle: 'Khoa Học Máy Tính & Cấu Trúc Dữ Liệu',
    startedAt: '2026-05-14T09:10:00.000Z',
    submittedAt: '2026-05-14T09:19:40.000Z',
    targetScore: 7, // 7/10
  },

  // 3. Lê Minh Ánh (minhanh.tester@gmail.com)
  {
    userEmail: 'minhanh.tester@gmail.com',
    topicTitle: 'HTML5 & Cấu Trúc Web Cơ Bản',
    startedAt: '2025-12-15T14:00:00.000Z',
    submittedAt: '2025-12-15T14:06:12.000Z',
    targetScore: 10, // 10/10
  },
  {
    userEmail: 'minhanh.tester@gmail.com',
    topicTitle: 'MongoDB & Thiết Kế NoSQL',
    startedAt: '2026-02-24T16:30:00.000Z',
    submittedAt: '2026-02-24T16:37:20.000Z',
    targetScore: 9, // 9/10
  },
  {
    userEmail: 'minhanh.tester@gmail.com',
    topicTitle: 'ReactJS & Modern Frontend',
    startedAt: '2026-05-13T11:00:00.000Z',
    submittedAt: '2026-05-13T11:08:50.000Z',
    targetScore: 8, // 8/10
  },

  // 4. Trần Đức Anh (ducanh.tech@gmail.com)
  {
    userEmail: 'ducanh.tech@gmail.com',
    topicTitle: 'CSS3 & Giao Diện Responsive',
    startedAt: '2026-01-18T10:30:00.000Z',
    submittedAt: '2026-01-18T10:35:45.000Z',
    targetScore: 6, // 6/10
  },
  {
    userEmail: 'ducanh.tech@gmail.com',
    topicTitle: 'JavaScript Core & ES6+ Nâng Cao',
    startedAt: '2026-02-20T14:15:00.000Z',
    submittedAt: '2026-02-20T14:22:30.000Z',
    targetScore: 8, // 8/10
  },
  {
    userEmail: 'ducanh.tech@gmail.com',
    topicTitle: 'Git & GitHub Trong Dự Án Nhóm',
    startedAt: '2026-05-16T16:00:00.000Z',
    submittedAt: '2026-05-16T16:05:20.000Z',
    targetScore: 9, // 9/10
  }
];

async function seed() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // 1. Dọn dẹp toàn bộ dữ liệu rác cũ
    const validTitles = sampleTopicsWithQuestions.map((t) => t.title);
    
    const junkTopics = await Topic.find({ title: { $nin: validTitles } });
    if (junkTopics.length > 0) {
      const junkIds = junkTopics.map((t) => t._id);
      console.log(`🧹 Đang xóa ${junkTopics.length} chủ đề rác cũ và các câu hỏi liên quan...`);
      await Question.deleteMany({ topicId: { $in: junkIds } });
      await Topic.deleteMany({ _id: { $in: junkIds } });
      console.log(`✨ Đã dọn dẹp xong dữ liệu rác!`);
    }

    // 2. Nạp hoặc cập nhật các bộ đề thi chuẩn với 10 câu mỗi bộ
    const topicsMap = new Map();
    for (const item of sampleTopicsWithQuestions) {
      let topic = await Topic.findOne({ title: item.title });
      if (!topic) {
        topic = new Topic({
          title: item.title,
          description: item.description,
        });
        await topic.save();
        console.log(`📌 Đã tạo chủ đề: ${item.title}`);
      } else {
        topic.description = item.description;
        await topic.save();
        console.log(`⚡ Cập nhật chủ đề: ${item.title}`);
      }

      topicsMap.set(item.title, topic);

      // Đảm bảo đủ 10 câu hỏi cho chủ đề này
      for (const qData of item.questions) {
        let questionDoc = await Question.findOne({
          topicId: topic._id,
          question: qData.question,
        });

        if (!questionDoc) {
          questionDoc = new Question({
            topicId: topic._id,
            question: qData.question,
            answers: qData.answers,
            correctAnswer: qData.correctAnswer,
          });
          await questionDoc.save();
          console.log(`   + Thêm câu hỏi: ${qData.question.substring(0, 45)}...`);
        }
      }
    }

    // 3. Khởi tạo danh sách Tài Khoản Test (mật khẩu mặc định: 123123)
    const defaultPasswordHash = await bcrypt.hash('123123', 10);
    const usersMap = new Map();

    console.log('\n👥 Đang khởi tạo danh sách tài khoản test...');
    for (const uData of testUsersData) {
      let user = await User.findOne({ email: uData.email });
      if (!user) {
        user = new User({
          fullname: uData.fullname,
          email: uData.email,
          password: defaultPasswordHash,
          gender: uData.gender,
          dob: uData.dob,
          role: uData.role,
          status: uData.status,
        });
        await user.save();
        console.log(`   + Tạo tài khoản: [${uData.email}] (${uData.fullname})`);
      } else {
        user.password = defaultPasswordHash;
        user.fullname = uData.fullname;
        user.gender = uData.gender;
        user.status = 'ACTIVE';
        await user.save();
        console.log(`   ⚡ Cập nhật tài khoản: [${uData.email}] (${uData.fullname})`);
      }
      usersMap.set(uData.email, user);
    }

    // 4. Khởi tạo danh sách Lịch Sử Làm Bài (Submissions) chân thực
    console.log('\n📝 Đang tạo dữ liệu bài làm trắc nghiệm lịch sử theo timeline...');
    // Xóa submissions cũ để tái tạo dữ liệu sạch sẽ
    await SubmissionAnswer.deleteMany({});
    await Submission.deleteMany({});

    for (const subItem of testSubmissionsTimeline) {
      const user = usersMap.get(subItem.userEmail);
      const topic = topicsMap.get(subItem.topicTitle);

      if (!user || !topic) continue;

      const questions = await Question.find({ topicId: topic._id });
      if (questions.length === 0) continue;

      const submission = new Submission({
        userId: user._id,
        topicId: topic._id,
        startedAt: new Date(subItem.startedAt),
        submittedAt: new Date(subItem.submittedAt),
        score: subItem.targetScore,
      });

      await submission.save();

      // Tạo câu trả lời cho từng câu hỏi với tỷ lệ đúng theo targetScore
      let correctAnswersGiven = 0;
      const allChoices = ['A', 'B', 'C', 'D'];

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        let selectedAnswer;
        let isCorrect = false;

        if (correctAnswersGiven < subItem.targetScore && (i < subItem.targetScore || Math.random() > 0.3)) {
          selectedAnswer = q.correctAnswer;
          isCorrect = true;
          correctAnswersGiven++;
        } else {
          const wrongChoices = allChoices.filter(c => c !== q.correctAnswer);
          selectedAnswer = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
          isCorrect = false;
        }

        const subAnswer = new SubmissionAnswer({
          submissionId: submission._id,
          questionId: q._id,
          question: q.question,
          answers: q.answers,
          selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
        });

        await subAnswer.save();
      }

      // Cập nhật điểm số chính xác
      submission.score = correctAnswersGiven;
      await submission.save();
      console.log(`   + Bài làm [${subItem.userEmail}] - ${subItem.topicTitle}: ${correctAnswersGiven}/${questions.length} điểm (${new Date(subItem.submittedAt).toLocaleDateString('vi-VN')})`);
    }

    const totalTopics = await Topic.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    console.log('\n======================================================');
    console.log(`🎉 Nạp dữ liệu hoàn tất thành công 100%!`);
    console.log(`📊 Tổng số chủ đề thi: ${totalTopics}`);
    console.log(`📝 Tổng số câu hỏi: ${totalQuestions}`);
    console.log(`👥 Tổng số tài khoản: ${totalUsers}`);
    console.log(`🏆 Tổng số bài nộp thi: ${totalSubmissions}`);
    console.log('======================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
}

seed();

