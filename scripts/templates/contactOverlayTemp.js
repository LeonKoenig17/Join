/**
 * Liefert das HTML-Overlay für „Add Contact“ (mode='add')
 * bzw. „Edit Contact“ (mode='edit').
 * @param {'add'|'edit'} mode
 * @returns {string} HTML-String
 */
function contactDetailsTemp(mode) {
  const isAdd = mode === 'add';
  const title  = isAdd ? 'Add contact' : 'Edit contact';
  const leftBtnLabel  = isAdd ? 'Cancel' : 'Delete';
  const leftBtnAction = isAdd 
    ? `hideContactForm('add')` 
    : `contactForm('delete','edit')`;
  const rightBtn = isAdd
    ? `<button onclick="contactForm('add','add')" id="rightBtn" class="contactBtn blueBtn">
         Create contact<img src="../images/check.svg" alt="" class="marginLeft10"/>
       </button>`
    : `<button onclick="contactForm('save','edit')" id="rightBtn" class="contactBtn blueBtn">
         Save<img src="../images/check.svg" alt="" class="marginLeft10"/>
       </button>`;

  return `
    <div id="addContactFrame" class="visibleNone" onclick="event.stopPropagation()">
      <img
        class="closeFormImg"
        src="../images/close.svg"
        alt="Close"
        onclick="hideContactForm('${mode}')"
      />

      <section id="addContactLeft">
        <div id="addContactDivMiddle">
          <img src="../images/joinlogowhite.svg" alt="Logo" />
          <h1>${title}</h1>
          <h4>Tasks are better with a team!</h4>
          <figure></figure>
        </div>
      </section>

      <div id="addContactRight">
        <div id="addContactRightDiv">
          <div id="addContactRightImg">
            <img src="../images/personwhite.svg" alt="Avatar" />
          </div>
          <div id="addContactRightInputs">
            <div class="flexColumn">
              <div class="inputDiv">
                <input type="text" id="nameInput"    placeholder="Name"  class="loginInput"/>
                <img   src="../images/person.svg" alt="Name" class="inputImg"/>
              </div>
              <div class="inputDiv">
                <input
                  type="text"
                  id="emailInput"
                  placeholder="Email"
                  class="loginInput"
                  ${!isAdd ? 'readonly' : ''}
                />
                <img src="../images/mail.svg" alt="Email" class="inputImg"/>
              </div>
              <div class="inputDiv">
                <input type="text" id="phoneInput" placeholder="Phone" class="loginInput"/>
                <img   src="../images/call.svg" alt="Phone" class="inputImg"/>
              </div>
            </div>
            <div class="flex marginTop10">
              <button
                onmouseover="changeImage('blue')"
                onmouseleave="changeImage('darkblue')"
                onclick="${leftBtnAction}"
                id="leftBtn"
                class="contactBtn whiteBtn"
              >
                ${leftBtnLabel}
                <img id="leftBtnImg" src="../images/canceldarkblue.svg" alt="" class="marginLeft10"/>
              </button>
              ${rightBtn}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
