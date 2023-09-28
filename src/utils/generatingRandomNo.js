class generateRandomNo {
  length;
  constructor(length) {
    this.length = length;
  }

  generateOtp() {
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let otp = '';

    for (let i = 0; i < this.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }

    return otp;
  }

  generate10RandomNo() {
    const alphabeticCharacters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    const numericDigits = '0123456789';

    let otp = '';

    // Generate the first 5 alphabetic characters
    for (let i = 0; i < this.length; i++) {
      const randomIndex = Math.floor(
        Math.random() * alphabeticCharacters.length
      );
      otp += alphabeticCharacters.charAt(randomIndex);
    }

    // Generate the last 5 numeric digits
    for (let i = 0; i < this.length; i++) {
      const randomIndex = Math.floor(Math.random() * numericDigits.length);
      otp += numericDigits.charAt(randomIndex);
    }

    return otp;
  }
}

module.exports = generateRandomNo;
