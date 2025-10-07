import { database } from "../models/database";

export const createSampleData = () => {
	const db = database.getDb();

	// Check if sample data already exists
	db.get("SELECT COUNT(*) as count FROM blog_posts", (err, row: any) => {
		if (err) {
			console.error("Error checking sample data:", err);
			return;
		}

		if (row.count > 0) {
			console.log("Sample data already exists");
			return;
		}

		// Create sample blog posts
		const samplePosts = [
			{
				title: "Welcome to My Personal Blog",
				slug: "welcome-to-my-personal-blog",
				content: `# Welcome to My Personal Blog

This is my first post on this new blog platform. I'm excited to share my thoughts, experiences, and insights with you.

## What You Can Expect

In this blog, I'll be writing about:

- **Technology**: Programming, web development, and tech trends
- **Lifestyle**: Personal experiences and life lessons
- **Travel**: Adventures and discoveries from around the world

## Getting Started

I've built this blog using modern web technologies:

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and SQLite
- **Content**: Markdown for easy writing and formatting

## Stay Connected

Feel free to explore the different categories and let me know what you think. I'm always open to feedback and suggestions for future posts.

Thanks for reading, and welcome to my corner of the internet!`,
				excerpt:
					"Welcome to my new personal blog where I share thoughts on technology, lifestyle, and travel.",
				category_id: 1, // Technology
				published: 1,
			},
			{
				title: "Building a Modern Blog with Next.js",
				slug: "building-modern-blog-nextjs",
				content: `# Building a Modern Blog with Next.js

In this post, I'll walk you through the process of building a modern, responsive blog using Next.js and other cutting-edge technologies.

## Why Next.js?

Next.js provides several advantages for building blogs:

1. **Server-Side Rendering (SSR)**: Better SEO and performance
2. **Static Site Generation (SSG)**: Fast loading times
3. **API Routes**: Built-in backend functionality
4. **TypeScript Support**: Type safety and better developer experience

## Key Features Implemented

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Clean, minimalist design
- Optimized for all screen sizes

### Content Management
- Markdown support for easy writing
- Category organization
- Search and filtering capabilities

### Admin Panel
- Secure authentication
- Post creation and editing
- Category management

## Code Structure

\`\`\`typescript
// Example API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request
  } else if (req.method === 'POST') {
    // Handle POST request
  }
}
\`\`\`

## Conclusion

Building a blog with Next.js has been a great experience. The framework provides all the tools needed to create a modern, performant website.

What would you like to see in future posts? Let me know in the comments!`,
				excerpt:
					"Learn how to build a modern, responsive blog using Next.js, TypeScript, and Tailwind CSS.",
				category_id: 1, // Technology
				published: 1,
			},
			{
				title: "My Journey into Web Development",
				slug: "journey-into-web-development",
				content: `# My Journey into Web Development

Today I want to share my personal journey into the world of web development and how it has changed my perspective on technology and creativity.

## The Beginning

It all started with a simple curiosity about how websites work. I remember the first time I viewed the source code of a webpage and saw all that HTML markup. It was like discovering a secret language.

## Learning Process

### HTML and CSS
- Started with basic HTML structure
- Learned CSS for styling and layout
- Discovered the power of responsive design

### JavaScript
- Began with simple DOM manipulation
- Moved on to more complex concepts
- Fell in love with the flexibility of the language

### Frameworks and Libraries
- Explored React and its ecosystem
- Learned about state management
- Discovered the joy of component-based architecture

## Challenges and Breakthroughs

### Early Struggles
- Understanding asynchronous programming
- Debugging complex issues
- Keeping up with rapidly changing technologies

### Key Breakthroughs
- Understanding the component lifecycle
- Mastering state management patterns
- Learning to think in terms of user experience

## Current Focus

Now I'm focused on:
- Building full-stack applications
- Learning about performance optimization
- Contributing to open source projects

## Lessons Learned

1. **Practice consistently**: Small daily practice beats sporadic intensive sessions
2. **Build projects**: Theory is important, but building real projects teaches you the most
3. **Join communities**: The web development community is incredibly supportive
4. **Stay curious**: Technology evolves rapidly, so continuous learning is essential

## Looking Forward

I'm excited about the future of web development. With technologies like WebAssembly, Progressive Web Apps, and new frameworks emerging, there's always something new to learn and explore.

What's your development journey been like? I'd love to hear about your experiences and challenges!`,
				excerpt:
					"A personal reflection on my journey into web development, the challenges I faced, and the lessons I learned along the way.",
				category_id: 2, // Lifestyle
				published: 1,
			},
			{
				title: "Exploring the Hidden Gems of Southeast Asia",
				slug: "hidden-gems-southeast-asia",
				content: `# Exploring the Hidden Gems of Southeast Asia

After months of planning, I finally embarked on my adventure through Southeast Asia. Here are some of the incredible hidden gems I discovered along the way.

## Planning the Trip

### Research Phase
- Studied local customs and traditions
- Learned basic phrases in local languages
- Researched visa requirements and travel restrictions

### Packing Strategy
- Lightweight, versatile clothing
- Essential electronics and chargers
- Travel documents and backup copies

## Destinations Visited

### 1. Luang Prabang, Laos
A UNESCO World Heritage city that feels frozen in time.

**Highlights:**
- Morning alms ceremony with Buddhist monks
- Kuang Si Falls with its turquoise pools
- Night market with local handicrafts

### 2. Hoi An, Vietnam
A charming ancient town known for its lantern-lit streets.

**Must-see:**
- Japanese Covered Bridge
- Tailor shops for custom clothing
- Cooking classes with local families

### 3. Bagan, Myanmar
Thousands of ancient temples spread across a vast plain.

**Experiences:**
- Hot air balloon ride at sunrise
- Temple hopping by bicycle
- Meeting local artisans

## Cultural Insights

### Food Culture
- Street food is the heart of Southeast Asian cuisine
- Each country has unique flavors and cooking methods
- Don't be afraid to try new dishes!

### Local Interactions
- People are generally friendly and helpful
- Learning a few local phrases goes a long way
- Respect local customs and dress codes

## Practical Tips

### Transportation
- Use local buses for authentic experiences
- Negotiate tuk-tuk and taxi fares
- Consider domestic flights for longer distances

### Accommodation
- Mix of hostels, guesthouses, and hotels
- Book in advance during peak seasons
- Read reviews and check locations carefully

### Budget Management
- Southeast Asia is generally affordable
- Street food is delicious and cheap
- Set aside money for unexpected expenses

## Memorable Moments

1. **Sunrise in Bagan**: Watching hundreds of hot air balloons rise over ancient temples
2. **Cooking Class in Hoi An**: Learning to make pho from a local family
3. **Monk Blessing in Luang Prabang**: Receiving a traditional blessing ceremony

## Lessons Learned

- **Embrace the unexpected**: Some of the best experiences come from unplanned moments
- **Travel slowly**: Rushing through destinations means missing the details
- **Connect with locals**: They know the best places and stories
- **Document everything**: Photos and journal entries help preserve memories

## Planning Your Own Adventure

If you're considering a similar trip:

1. **Start with research**: Learn about visa requirements and best times to visit
2. **Be flexible**: Plans will change, and that's part of the adventure
3. **Pack light**: You'll be moving around frequently
4. **Stay open-minded**: Embrace different cultures and experiences

## Conclusion

Southeast Asia exceeded all my expectations. The combination of rich history, diverse cultures, stunning landscapes, and warm hospitality made it an unforgettable journey.

Have you traveled to Southeast Asia? I'd love to hear about your experiences and recommendations for future trips!`,
				excerpt:
					"Discover the hidden gems of Southeast Asia through my travel experiences, from ancient temples to local cuisine and cultural insights.",
				category_id: 3, // Travel
				published: 1,
			},
		];

		// Insert sample posts
		const stmt = db.prepare(`
      INSERT INTO blog_posts (title, slug, content, excerpt, category_id, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

		samplePosts.forEach((post) => {
			stmt.run(
				post.title,
				post.slug,
				post.content,
				post.excerpt,
				post.category_id,
				post.published
			);
		});

		stmt.finalize();
		console.log("Sample blog posts created successfully");
	});
};
