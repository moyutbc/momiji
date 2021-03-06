import { Redmine } from '~/gateways/redmine'

export abstract class Orm {
  private static format = 'json'

  /**
   * 継承しているクラスを取得する。
   */
  abstract getResourceClass(): any

  static get className(): string { }

  /**
   * 複数形に変化させる。
   */
  private static pluralize(noun: string): string {
    if ([/s$/, /x$/, /z$/, /sh$/, /ch$/].some(regex => regex.test(noun))) {
      return `${noun}es`
    }
    if (/[^aiueo]y$/.test(noun)) {
      return `${noun.slice(0, -1)}ies`
    }
    return `${noun}s`
  }

  /**
   * クラス名をリソース名に置き換える。
   */
  private static getResourceName(): string {
    return this.className
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .filter(el => el.length > 0)
      .map(el => el.toLowerCase())
      .join('_')
  }

  /**
   * クラスに対応するリソース名を返却する。
   */
  public static getResourcesName() {
    return this.pluralize(this.getResourceName())
  }

  private static getResourcesPath(id?: number): string {
    return id
      ? `/${this.getResourcesName()}/${id}.${this.format}`
      : `/${this.getResourcesName()}.${this.format}`
  }

  public static getUrl(id?: number | string): string {
    let url = '/' + this.getResourcesName()
    if (id) {
      url += '/' + id
    }
    return url
  }

  static async get(url: string, params = {}) {
    return await Redmine.instance.get(url, params)
  }

  static async all(params = {}): Promise<Array<this>> {
    return await this.where(params)
  }

  static async find(id: number, params = {}): Promise<this> {
    const url = this.getResourcesPath(id)
    const res = await this.get(url, params)
    return new this(res[this.getResourceName()])
  }

  static async where(conditions = {}): Promise<Array<this>> {
    const tmpConditions = {
      limit: 100,
      offset: 0,
      ...conditions
    }
    const url = this.getResourcesPath()
    const results = []

    // 1ページ目を取得
    const res = await this.get(url, tmpConditions)
    const tmp = res[this.getResourcesName()].map(elem => new this(elem))
    results.push(...tmp)

    // ページング未対応APIの場合
    if (!res.total_count || !res.limit) {
      return res[this.getResourcesName()]
    }

    // 2ページ目以降を取得
    const pageCount = Math.ceil(res.total_count / res.limit)
    const pageIndices = Array.from(new Array(pageCount))
      .map((_, i) => i)
      .splice(1)
    const promises = pageIndices.map(i => {
      tmpConditions.offset = i * res.limit
      return this.get(url, tmpConditions)
    })
    const responses = await Promise.all(promises)

    return responses.reduce((arr, res) => {
      const tmp = res[this.getResourcesName()].map(elem => new this(elem))
      return arr.concat(tmp)
    }, results)
  }

  /**
   * 更新
   */
  public async update(params: { [s: stirng]: any }) {
    const url = this.getResourceClass().getResourcesPath(this.id)
    return await Redmine.instance.put(url, params)
  }

  public destroy() { }
}
