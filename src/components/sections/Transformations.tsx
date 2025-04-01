import BeforeAfter from './BeforeAfter';

const transformations = [
  {
    title: 'Driveway Transformation',
    beforeImage: '/images/driveway-before.jpg',
    afterImage: '/images/driveway-after.jpg',
    beforeAlt: 'Dirty driveway before pressure washing',
    afterAlt: 'Clean driveway after pressure washing'
  },
  {
    title: 'House Exterior Cleaning',
    beforeImage: '/images/house-before.jpg',
    afterImage: '/images/house-after.jpg',
    beforeAlt: 'House exterior before cleaning',
    afterAlt: 'House exterior after cleaning'
  },
  {
    title: 'Commercial Building Restoration',
    beforeImage: '/images/commercial-before.jpg',
    afterImage: '/images/commercial-after.jpg',
    beforeAlt: 'Commercial building before cleaning',
    afterAlt: 'Commercial building after cleaning'
  }
];

const Transformations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Transformations</h2>
          <p className="text-xl text-gray-600">See the dramatic difference our pressure washing services can make</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((transform, index) => (
            <BeforeAfter
              key={index}
              title={transform.title}
              beforeImage={transform.beforeImage}
              afterImage={transform.afterImage}
              beforeAlt={transform.beforeAlt}
              afterAlt={transform.afterAlt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transformations; 