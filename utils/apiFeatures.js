class ApiFeaturers {
  constructor(query, qeuryString) {
    this.query = query;
    this.qeuryString = qeuryString;
  }

  filter() {
    const queryObj = { ...this.qeuryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.qeuryString.sort) {
      const sortBy = this.qeuryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.qeuryString.fields) {
      const fields = this.qeuryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.qeuryString.page * 1 || 1;
    const limit = this.qeuryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=2&limit=10, 1-10,  page 1, 11-20, page 2, 21-30 page 3
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeaturers;
