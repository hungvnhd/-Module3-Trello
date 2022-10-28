const baseApi = "http://127.0.0.1:3000/";
const tbody = document.getElementById("tbody");
const logout = document.querySelector(".signout-btn");
const ul = document.getElementsByClassName("pagination")[0];

const showMessage = (status, message) => {
  let messageContainer = document.getElementsByClassName("message")[0];
  if (status === "delete") {
    messageContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
  if (status === "update") {
    messageContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
  }
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 3000);
};

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(baseApi + `blogs/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        showMessage("delete", data.message);
        e.target.parentElement.parentElement.remove();
        console.log(data);
      })
      .catch((err) => {
        showMessage("delete", err.message);
      });
  }

  if (e.target.classList.contains("btn-update")) {
    // GET id
    let id = e.target.id.split("-")[1]; // update-1, update-2...

    // GET current row (Lấy ra dòng hiện tại của nút update)
    let td = e.target.parentElement.parentElement;

    // GET current row children
    // Lấy toàn bộ phần tử con (td list) của dòng hiện tại
    let tdChildList = e.target.parentElement.parentElement.children;

    // Lấy ra toàn bộ thông tin của user nằm trong từng ô (từng td)
    let info = {
      index: tdChildList[0].innerHTML,
      id: tdChildList[1].innerHTML,
      title: tdChildList[2].innerHTML.trim(),
      content: tdChildList[3].innerHTML.trim(),
      image: tdChildList[4].children[0].src,
      user_id: tdChildList[5].innerHTML,
    };
    // console.log(tdChildList[4].children[0].src);

    // Fill toàn bộ thông tin lấy được ở trên vào template dòng mới
    // đã được thay thế bằng input.value
    td.innerHTML = `
    <tr>
        <th scope="row">
            ${info.index}
        </th>
        <td>${info.id}</td>
        <td><input type="text" value="${info.title}"></td>
        <td><input type="text" value="${info.content}"></td>
        <td><input type="text" value="${info.image}"></td>
        <td><input type="text" value="${info.user_id}"></td>
        <td class="action">
            <span id="${info.id}" class="btn-delete btn btn-danger">
                <ion-icon name="trash-outline"></ion-icon>
            </span>
            <span id="save-${info.id}" class="btn-save btn btn-info">
                Save
            </span>
        </td>
    </tr>
    `;
  }

  if (e.target.classList.contains("btn-save")) {
    // GET id
    let id = e.target.id.split("-")[1]; // update-1, update-2...

    // GET current row (Lấy ra dòng hiện tại của nút update)
    let td = e.target.parentElement.parentElement;

    // GET current row children
    // Lấy toàn bộ phần tử con (td list) của dòng hiện tại
    let tdChildList = e.target.parentElement.parentElement.children;

    let info = {
      index: tdChildList[0].innerHTML,
      id: tdChildList[1].innerHTML,
      title: tdChildList[2].children[0].value,
      content: tdChildList[3].children[0].value,
      image: tdChildList[4].innerHTML,
      user_id: tdChildList[5].innerText,

    };
    // .innerHTML ---> text (input) "<input />"

    // .children ---> 1 mảng HTML, [0] --> .value
    console.log(info.website, info.phone);

    // Tiến hành gọi fetch update
    fetch(baseApi + `blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showMessage("update", data.message);
        // DOM để đổi lại dòng hiện tại thành một dòng bình thường không có
        // input nằm ở bên trong nữa
        td.innerHTML = `
        <tr>
            <th scope="row">
                ${info.index}
            </th>
            <td>${info.id}</td>
            <td>${info.title}</td>
            <td>${info.content}</td>
            <td>${info.image}</td>
            <td>${info.user_id}</td>
            <td class="action">
                <span id="${info.id}" class="btn-delete btn btn-danger">
                    <ion-icon name="trash-outline"></ion-icon>
                </span>
                <span id="save-${info.id}" class="btn-update btn btn-info">
                  <ion-icon name="build-outline"></ion-icon>
                </span>
            </td>
        </tr>
        `;
      })
      .catch((err) => console.log(err));

    // Đổi lại nut save thành icon update

    // Hiển thị ra message update thành công
  }
});

logout.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(baseApi + "auth/logout")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

ul.addEventListener("click", (e) => {
  console.log(e.target);
});

window.onload = function () {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  let pages = document.getElementsByClassName("page-item");
  let activePage = params.page_index;
  pages = Array.from(pages);
  pages.pop();
  pages.shift();
  pages[activePage - 1].classList.add("active");
};

