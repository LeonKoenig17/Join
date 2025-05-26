/**
 * Liefert das HTML-Overlay für „Add Contact“ (mode='add')
 * bzw. „Edit Contact“ (mode='edit').
 * @param {'add'|'edit'} mode
 * @param {'big'|'small'} size
 * @returns {string} HTML-String
 */
function contactDetailsTemp(mode, size) {
  const isAdd = mode === 'add';
  const title = isAdd ? 'Add contact' : 'Edit contact';
  const leftBtnLabel = isAdd ? 'Cancel' : 'Delete';
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

  // if(size == 'big'){
  return `
    <div id="addContactFrame" class="visibleNone" onclick="event.stopPropagation()">
      <img id="closeFormImg"
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
          
            
            <div id="addContactRightInitialsDiv" class="grayBackground">
              <img id="addContactRightImg" src="../images/personwhite.svg" alt="Avatar"/>
              <span id="addContactRightInitials" class="hide">ZZ</span>
            </div>
          
          <div id="addContactRightInputs">
            <div class="flexColumn" style="gap: 20px">
             <div id="addContactBtnDiv" class="flexColumn">
                 <input type="text" id="nameInput" placeholder="Name"  class="loginInput personImgBackground"/>
                 <input type="text" id="emailInput" placeholder="Email" class="loginInput mailImgBackground"/>
                 <input type="text" id="phoneInput" placeholder="Phone" class="loginInput callImgBackground"/>
            </div>
            <div class="addContactBtnDiv" style="width: fit-content;">
              <button
                onmouseover="changeImage('leftBtnImg','cancelblue')"
                onmouseleave="changeImage('leftBtnImg','canceldarkblue')"
                onclick="${leftBtnAction}"
                id="leftBtn"
                class="contactBtn whiteBtn">
                ${leftBtnLabel}
                <img id="leftBtnImg" src="../images/canceldarkblue.svg" alt="" class="marginLeft10"/>
              </button>
              ${rightBtn}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  // ;}
  //   else{
  //     return `
  //   <div id="addContactFrame" class="visibleNone" onclick="event.stopPropagation()">
  //     <img
  //       class="closeFormImg"
  //       src="../images/close.svg"
  //       alt="Close"
  //       onclick="hideContactForm('${mode}')"
  //     />

  //     <section id="addContactLeft">
  //       <div id="addContactDivMiddle">
  //         <img src="../images/joinlogowhite.svg" alt="Logo" />
  //         <h1>${title}</h1>
  //         <h4>Tasks are better with a team!</h4>
  //         <figure></figure>
  //       </div>
  //     </section>

  //     <div id="addContactRight">



  //           <img id="addContactRightImg" src="../images/personwhite.svg" alt="Avatar" />


  //         <div id="addContactRightInputs">
  //           <div class="flexColumn">
  //               <input type="text" id="nameInput" placeholder="Name"  class="loginInput personImgBackground"/>
  //               <input type="text" id="emailInput" placeholder="Email" class="loginInput mailImgBackground" ${!isAdd ? 'readonly' : ''}/>
  //               <input type="text" id="phoneInput" placeholder="Phone" class="loginInput callImgBackground"/>
  //           </div>

  //           <div class="flexRow marginTop10">
  //             <button onmouseover="changeImage('leftBtnImg','cancelblue')" onmouseleave="changeImage('leftBtnImg','canceldarkblue')" onclick="${leftBtnAction}" id="leftBtn" class="contactBtn whiteBtn">
  //               ${leftBtnLabel}
  //               <img id="leftBtnImg" src="../images/canceldarkblue.svg" alt="" class="marginLeft10"/>
  //             </button>
  //             ${rightBtn}
  //           </div>

  //         </div>


  //     </div>
  //   </div>
  // `;
  //   }
}
