export function capitalize(word: string) {
  if (word !== '') {
    try {
      word = word.toLocaleLowerCase();
      return word[0].toUpperCase() + word.slice(1);
    } catch (error) {
      return word;
    }
  }
}

export function capitalizeAllWords(word: string) {
  if (word !== '') {
    try {
      word = word.toLocaleLowerCase();
      return word
        .split(' ')
        .map((wrd: string) => wrd[0].toUpperCase() + wrd.slice(1))
        .join(' ');
    } catch (error) {
      return word;
    }
  }
}

export function separePhoneNumber(phone: string) {
  if (phone.length === 9) {
    try {
      let separate = '';
      for (let i = 0; i < phone.length; i++) {
        separate += phone[i];
        if ((i + 1) % 3 === 0) {
          separate += ' ';
        }
      }
      return separate;
    } catch (error) {
      return phone;
    }
  }
}
