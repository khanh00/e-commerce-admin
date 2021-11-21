class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryStr = JSON.stringify(this.queryString);
    queryStr = queryStr.replace(
      /\bgt|gte|lt|lte|text[^textScore]|search|regex|options|meta\b/g,
      (match) => `$${match}`
    );

    const queryObj = JSON.parse(queryStr);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((key) => delete queryObj[key]);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-updateAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    if (this.queryString.limit) {
      const page = Number(this.queryString.page) || 1;
      const limit = Number(this.queryString.limit);
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = ApiFeatures;
