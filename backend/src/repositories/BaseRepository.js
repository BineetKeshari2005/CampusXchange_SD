/**
 * OOP CONCEPT: Abstraction + Encapsulation
 * BaseRepository abstracts all common DB operations.
 * All specific repositories INHERIT from this class.
 *
 * SOLID - OCP: Open for extension (subclasses add methods), closed for modification.
 * SOLID - DIP: Services depend on this abstraction, not on Mongoose directly.
 * SOLID - LSP: Any subclass can replace BaseRepository wherever it is used.
 */

class BaseRepository {
  #model; // OOP: Encapsulation — model is private

  constructor(model) {
    this.#model = model;
  }

  // Protected getter for subclasses
  get model() {
    return this.#model;
  }

  async findById(id, populate = null) {
    let query = this.#model.findById(id);
    if (populate) query = query.populate(populate);
    return query;
  }

  async findOne(filter) {
    return this.#model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    const { sort, skip, limit, populate } = options;
    let query = this.#model.find(filter);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    if (populate) query = query.populate(populate);
    return query;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async updateById(id, data, options = { new: true }) {
    return this.#model.findByIdAndUpdate(id, data, options);
  }

  async updateOne(filter, data, options = { new: true }) {
    return this.#model.findOneAndUpdate(filter, data, options);
  }

  async deleteById(id) {
    return this.#model.findByIdAndDelete(id);
  }

  async deleteOne(filter) {
    return this.#model.findOneAndDelete(filter);
  }

  async count(filter = {}) {
    return this.#model.countDocuments(filter);
  }
}

export default BaseRepository;
