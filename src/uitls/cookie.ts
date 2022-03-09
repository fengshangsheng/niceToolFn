class Cookie {
  set(name: string, value: string, option: any = { expiresTime: '', path: '/' }) {
    document.cookie = `${name}=${value}; expires=${option.expiresTime}; path=${option.path}`
  }

  get(name: string) {
    const cookies = document.cookie.split(';');
    const item = cookies.find((item) => item.trim().indexOf(name) === 0)
    if (item) {
      return item.split('=')[1]
    }
    return undefined
  }

  del(name: string) {
    this.set(name, '', {
      expiresTime: -1
    });
  }
}

export default new Cookie()
