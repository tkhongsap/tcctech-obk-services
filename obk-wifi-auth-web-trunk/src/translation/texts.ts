type Translations = {
  title: string
  subtitle: string
  consent: string
  consentButton: string
  acceptConsent: string
  mobile: string
  code: string
  mobileHint: string
  acceptMobile: string
  otp: string
  otpHint: string
  acceptOtp: string
  errorCaptcha: string
  errorOtp: string
  errorTryAgain: string
  errorOtpMax: string
  errorMaxCount: string
  errorCount: string
  errorExpire: string
  errorConnect: string
  errorGlobal: string
  acceptError: string
  successBody: string
  successCallCenter: string
  successEmail: string
  explore: string
  validateMobileDigit: string
  validateMobile: string
  validateOtpDigit: string
  countText: string
  countUnit: string
  backText: string
}

const texts: Record<string, Translations> = {
  en: {
    title: 'WiFi Captive Portal',
    subtitle: 'Guest Wi-Fi Access',
    consent:
      '<p>I</p> <p>hereby</p> <p>give</p> <p>my</p> <p>consent</p> <p>in</p> <p>accordance</p> <p>with</p> <p>the</p> <p>Personal</p> <p>Data</p> <p>Protection</p><p> </p><p>Act</p> <p>B</p><p>.</p><p>E</p><p>.</p> <p>2562</p> <p>to</p> <p>One Bangkok</p> <p>Co.,</p> <p>Ltd</p><p>.</p> <p>(“the Company”),</p> <p>including</p> <p>its</p> <p>affiliates</p> <p>and</p> <p>agents</p><p>,</p> <p>to</p> <p>collect</p><p>,</p><p> </p><p>use</p><p>,</p> <p>disclose</p> <p>and</p><p>/</p><p>or</p> <p>transfer</p> <p>of</p> <p>my</p> <p>Personal</p> <p>Data</p> <p>to</p> <p>an</p> <p>authorized</p><p> </p><p>person</p> <p>or</p> <p>third</p> <p>parties</p> <p>from</p> <p>One Bangkok</p><p>’</p><p>s</p> <p>wifi</p> <p>connection</p> <p>for</p> <p>the</p><p> </p><p>purposes</p> <p>of</p> <p>registration</p> <p>and</p> <p>authentication</p> <p>my</p> <p>identity</p><p>,</p> <p>complying</p> <p>with</p><p> </p><p>legal</p> <p>obligations</p><p>,</p> <p>security</p> <p>purposes</p> <p>and</p> <p>for</p> <p>management</p> <p>of</p> <p>the</p> <p>IT</p><p> </p><p>operations</p><p>,</p> <p>management</p> <p>of</p> <p>communication</p> <p>system</p><p>,</p> <p>operation</p> <p>of</p> <p>IT</p> <p>security</p><p> </p><p>and</p> <p>IT</p> <p>security</p> <p>audit</p> <p>including</p> <p>to</p> <p>analyze</p> <p>personal</p> <p>data</p> <p>within</p> <p>the</p><p> </p><p>Company</p><p>,</p> <p>its</p> <p>affiliates</p><p>,</p> <p>subsidiaries</p><p>,</p> <p>or</p> <p>authorized</p> <p>person</p> <p>by</p> <p>the</p><p> </p><p>Company</p><p>,</p> <p>to</p> <p>develop</p> <p>services</p><p>,</p> <p>systems</p><p>,</p> <p>and</p> <p>business</p> <p>operations</p> <p>of</p> <p>the</p><p> </p><p>Company</p><p>.</p> <p>Check</p> <p>the</p> <p>Company</p><p>’</p><p>s</p> <p>Privacy</p> <p>Policy</p> <p>at</p>',
    consentButton: 'Back to Top',
    acceptConsent: 'I agree to the consent',
    mobile: 'Mobile Number',
    code: 'Captcha Code',
    mobileHint:
      '<p>The</p> <p>phone</p> <p>number</p> <p>can</p> <p>be</p> <p>connected</p> <p>to</p> <p>only</p> <p>one</p> <p>device.</p>',
    acceptMobile: 'Get OTP',
    otp: 'OTP',
    otpHint:
      '<p>Please</p> <p>enter</p> <p>your</p> <p>OTP</p> <p>received</p> <p>via</p> <p>SMS</p> <p>within</p> <p>5</p> <p>minutes.</p>',
    acceptOtp: 'Confirm to connect',
    errorCaptcha:
      '<p>Invalid</p> <p>Captcha Code.</p><br /><br />Please try again.<br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    errorOtp: 'Invalid OTP.',
    errorTryAgain:
      'Please try again.<br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    errorOtpMax:
      // '<p>Invalid</p> <p>OTP</p> <p>exceeded</p> <p>the</p> <p>maximum.</p><br /><br />Please try again after 5 minutes.<br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
      '<p>Something</p> <p>went</p> <p>wrong</p>, <p>please</p> <p>try</p> <p>again</p> in 1 <p>minutes.</p><br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    errorMaxCount:
      '<p>Invalid</p> <p>OTP</p> <p>exceeded</p> <p>the</p> <p>maximum.</p>',
    errorCount: 'Please try again after',
    errorExpire:
      '<p>OTP</p> <p>has</p> <p>expired.</p><br /><br /><p>Please</p> <p>click</p> <p>the</p> <p>button</p> <p>below</p> <p>to</p> <p>get</p> <p>OTP</p> <p>again.</p><br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    errorConnect:
      'Connection Failed.<br /><br /><p>This</p> <p>phone</p> <p>number</p> <p>is</p> <p>already</p> <p>used</p> <p>by</p> <p>another</p> <p>device.</p><br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    errorGlobal:
      'Sorry, <p>something</p> <p>when</p> <p>wrong.</p><br /><br /><p>If</p> <p>there</p> <p>is</p> <p>any</p> <p>query</p> <p>please</p> <p>contact</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>tel. 02 483 5555</p>',
    acceptError: 'Try again',
    successBody:
      '<p>Welcome</p> <p>to</p> <p>One Bangkok</p> <p>Guest</p> <p>Wi-Fi</p> <p>Access.</p> <p>If</p> <p>you</p> <p>have</p> <p>any</p> <p>question</p> <p>please</p> <p>contact</p> <p>Operation</p> <p>Services</p> <p>Admin</p>',
    successCallCenter: 'Call Center: 02 483 5555',
    successEmail: 'Email: admin@onebangkok.com',
    explore: 'Explore to One Bangkok',
    validateMobileDigit: 'Mobile number must be 10 digits.',
    validateMobile: 'Please enter a valid mobile number.',
    validateOtpDigit: 'OTP must be 6 digits.',
    countText: 'Please wait for a new OTP after',
    countUnit: 'seconds',
    backText: 'Back',
  },
  th: {
    title: 'ช่องทางสำหรับการเข้าใช้งานไวไฟ',
    subtitle: 'Guest Wi-Fi Access',
    consent:
      '<p>ข้าพเจ้า</p><p>ขอให้</p><p>ความยินยอม</p><p>ตาม</p><p>พระราชบัญญัติ</p><p>คุ้มครอง</p><p>ข้อมูล</p><p>ส่วนบุคคล</p> <p>พ.ศ.</p>2562<p> แก่</p><p>บริษัท</p> <p>วัน แบงค็อก</p> <p>จำกัด</p> <p>(“บริษัทฯ”)</p> <p>รวมถึง</p><p>บริษัท</p><p>ในเครือ</p><p>และ</p><p>ตัวแทน</p> <p>ใน</p><p>การ</p><p>เก็บ</p><p>รวบรวม</p> <p>ใช้</p> <p>เปิดเผย</p> <p>และ</p>/<p>หรือ</p><p>โอน</p><p>ข้อมูล</p><p>ส่วนบุคคล</p><p>ของ</p><p>ข้าพเจ้า</p><p>ไป</p><p>ยัง</p><p>ผู้</p><p>ที่</p><p>ได้รับ</p><p>การ</p><p>แต่งตั้ง</p><p>โดย</p><p>บริษัทฯ</p><p>หรือ</p><p>บุคคลที่สาม</p> <p>จาก</p><p>การ</p><p>ที่</p><p>ข้าพเจ้า</p><p>ได้</p><p>เข้า</p><p>สมัคร</p><p>ใช้งาน</p><p>สัญญาณ</p><p>เชื่อมต่อ</p><p>ระบบ</p><p>อินเทอร์เน็ต</p><p>แบบ</p><p>ไร้สาย</p> <p>(“wifi”)</p> <p>ของ</p> <p>วัน แบงค็อก</p> <p>เพื่อ</p><p>วัตถุประสงค์</p><p>ใน</p><p>การ</p><p>ลงทะเบียน</p> <p>ยืนยัน</p><p>ระบุ</p><p>ตัวตน</p> <p>เพื่อ</p><p>ปฏิบัติตาม</p><p>ข้อผูกพัน</p><p>ทางกฎหมาย</p><p>เพื่อ</p><p>วัตถุประสงค์</p><p>ด้าน</p><p>ความปลอดภัย</p> <p>และ</p><p>เพื่อ</p><p>รักษาการ</p><p>ปฏิบัติงาน</p><p>ด้าน</p><p>ไอที</p><p>การ</p><p>จัดการ</p><p>ระบบ</p><p>สื่อสาร</p> <p>การ</p><p>ดำเนินงาน</p><p>ด้าน</p><p>ความปลอดภัย</p><p>ของ</p><p>ระบบ</p><p>ไอที</p><p>และ</p><p>การ</p><p>ตรวจสอบ</p><p>ความปลอดภัย</p><p>ของ</p><p>ระบบ</p><p>ไอที</p> <p>รวมทั้ง</p><p>เพื่อ</p><p>ดำเนินการ</p><p>วิเคราะห์</p><p>ข้อมูล</p><p>เกี่ยวกับ</p><p>ข้อมูล</p><p>ส่วนบุคคล</p><p>ของ</p><p>ข้าพเจ้า</p><p>ภายใน</p><p>กลุ่ม</p><p>บริษัท</p><p>วัน แบงค็อก</p> <p>จำกัด</p> <p>บริษัท</p><p>ในเครือ</p> <p>บริษัท</p><p>ย่อย</p> <p>หรือ</p><p>บุคคล</p><p>ที่</p><p>ได้รับ</p><p>การ</p><p>แต่งตั้ง</p><p>โดย</p><p>บริษัทฯ</p> <p>เพื่อ</p><p>พัฒนา</p><p>บริการ</p> <p>ระบบ</p><p>         </p><p>และ</p><p>การ</p><p>ดำเนิน</p><p>ธุรกิจ</p><p>ของ</p><p>บริษัทฯ</p><p> </p><p>ตรวจสอบ</p><p>นโยบาย</p><p>ความเป็นส่วนตัว</p><p>ของ</p><p>บริษัทฯ</p><p>ได้ที่</p>',
    consentButton: 'ย้อนกลับไปข้างบน',
    acceptConsent: 'ฉันให้ความยินยอม',
    mobile: 'กรุณากรอกเบอร์โทรศัพท์',
    code: 'รหัสยืนยัน',
    mobileHint: 'หมายเลขโทรศัพท์นี้สามารถเชื่อมต่อได้เพียงหนึ่งอุปกรณ์เท่านั้น',
    acceptMobile: 'ยืนยันเบอร์โทรศัพท์รับ OTP',
    otp: 'กรุณากรอก OTP ที่ได้รับ',
    otpHint:
      '<p>กรุณากรอก</p> <p>OTP</p> <p>ที่ได้รับทาง</p> <p>SMS</p> <p>ภายใน</p> <p>5</p> <p>นาที</p>',
    acceptOtp: 'ยืนยัน',
    errorCaptcha:
      'รหัสไม่ถูกต้อง<br /><br /><p>กรุณากดปุ่มด้านล่างเพื่อกรอกรหัส</p> <p>Captcha</p> <p>ใหม่อีกครั้ง</p><br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    errorOtp: 'รหัส OTP ไม่ถูกต้อง',
    errorTryAgain:
      'กรุณาลองใหม่อีกครั้ง<br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    errorOtpMax:
      // 'รหัส OTP <p>ไม่ถูกต้องเกินจำนวนครั้งที่กำหนด</p><br /><br /><p>กรุณาขอรหัส</p> <p>OTP</p> <p>ใหม่หลังจากครบ 5 นาที</p><br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
      'ดำเนินการไม่สำเร็จ <p>กรุณาขอ</p> <p>OTP</p> <p>ใหม่อีกครั้งหลังครบ 1 นาที</p><br /><br /><p>กรุณาขอรหัส</p> <p>OTP</p> <p>ใหม่หลังจากครบ 5 นาที</p><br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    errorMaxCount: 'รหัส OTP <p>ไม่ถูกต้องเกินจำนวนครั้งที่กำหนด</p>',
    errorCount: 'กรุณาขอรหัส OTP ใหม่หลังจากครบ',
    errorExpire:
      'รหัส OTP หมดอายุ<br /><br /><p>กรุณากดปุ่มด้านล่างเพื่อรับ</p> <p>OTP</p> <p>ใหม่อีกครั้ง</p><br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    errorConnect:
      'การเชื่อมต่อล้มเหลว<br /><br />หมายเลขโทรศัพท์นี้ถูกเชื่อมต่อบนอุปกรณ์อื่นแล้ว<br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    errorGlobal:
      'พบปัญหาบางอย่าง กรุณาติดต่อเจ้าหน้าที่<br /><br /><p>กรณีพบปัญหา</p> <p>กรุณาติดต่อ</p> <p>One Bangkok</p> <p>Contact</p> <p>Center</p> <p>เบอร์โทร 02 483 5555</p>',
    acceptError: 'ลองใหม่อีกครั้ง',
    successBody:
      'ยินดีต้อนรับสู่ <p>One Bangkok</p> <p>Guest</p> <p>Wi-Fi</p> หากพบปัญหากรุณาติดต่อเจ้าหน้าที่',
    successCallCenter: 'Call Center: 02 483 5555',
    successEmail: 'Email: admin@onebangkok.com',
    explore: 'ยินดีต้อนรับสู่ One Bangkok',
    validateMobileDigit: 'กรุณากรอกเบอร์โทรศัพท์ 10 ตัวอักษร',
    validateMobile: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง',
    validateOtpDigit: 'กรุณากรอก OTP 6 ตัวอักษร',
    countText: 'กรุณารอขอ OTP ใหม่อีกครั้ง หลังครบ',
    countUnit: 'วินาที',
    backText: 'ย้อนกลับ',
  },
}

export default texts
