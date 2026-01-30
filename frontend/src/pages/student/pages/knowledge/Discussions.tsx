import { useState } from 'react';
import PageHeader from '@/pages/student/components/layout/PageHeader';
import SectionCard from '@/pages/student/components/common/SectionCard';
import Modal from '@/pages/student/components/common/Modal';
import Badge from '@/pages/student/components/common/Badge';
import KnowledgeNavBar from '@/pages/student/components/layout/KnowledgeNavBar';
import { MessageSquare, ThumbsUp, Send, Plus, Clock, User } from 'lucide-react';
import { useToast } from '@/pages/student/hooks/use-toast';
import { formatDate } from '@/pages/student/utils/formatDate';

interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  subject: string;
  createdAt: string;
  replies: Reply[];
  likes: number;
}

const initialDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Understanding Binary Search Tree Rotations',
    content: 'Can someone explain AVL tree rotations with examples? I\'m having trouble understanding left-right and right-left rotations.',
    author: 'Rahul Sharma',
    authorRole: 'Student',
    subject: 'Data Structures',
    createdAt: '2024-03-15',
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: 'Dr. Sharma',
        content: 'Great question! AVL rotations are used to maintain balance. LL rotation is for left-left case, RR for right-right, LR for left-right (double rotation), and RL for right-left case. I\'ll cover this in tomorrow\'s class with diagrams.',
        createdAt: '2024-03-15',
        likes: 8,
      },
      {
        id: '1-2',
        author: 'Priya Mehta',
        content: 'I found this visualization helpful: https://visualgo.net/en/bst - it shows rotations step by step.',
        createdAt: '2024-03-16',
        likes: 5,
      },
    ],
  },
  {
    id: '2',
    title: 'SQL vs NoSQL: When to use which?',
    content: 'For our project, should we use MongoDB or PostgreSQL? What are the key factors to consider?',
    author: 'Amit Kumar',
    authorRole: 'Student',
    subject: 'Database Systems',
    createdAt: '2024-03-14',
    likes: 8,
    replies: [
      {
        id: '2-1',
        author: 'Prof. Patel',
        content: 'Consider your data structure: if it\'s highly relational with complex joins, use PostgreSQL. If your data is document-oriented and you need flexibility, MongoDB is better. Also consider: transaction requirements, scaling needs, and team expertise.',
        createdAt: '2024-03-14',
        likes: 15,
      },
    ],
  },
  {
    id: '3',
    title: 'Process vs Thread: Memory Sharing',
    content: 'How exactly do threads share memory differently from processes? Can someone explain the stack and heap allocation?',
    author: 'Sneha Patel',
    authorRole: 'Student',
    subject: 'Operating Systems',
    createdAt: '2024-03-12',
    likes: 6,
    replies: [],
  },
];

export default function Discussions() {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', subject: 'Data Structures' });

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'Rahul Sharma',
      authorRole: 'Student',
      subject: newPost.subject,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: [],
    };

    setDiscussions([newDiscussion, ...discussions]);
    setIsModalOpen(false);
    setNewPost({ title: '', content: '', subject: 'Data Structures' });
    toast({ title: 'Discussion posted successfully' });
  };

  const handleReply = (discussionId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: `${discussionId}-${Date.now()}`,
      author: 'Rahul Sharma',
      content: replyContent,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    setDiscussions(discussions.map(d => 
      d.id === discussionId 
        ? { ...d, replies: [...d.replies, newReply] }
        : d
    ));

    if (selectedDiscussion?.id === discussionId) {
      setSelectedDiscussion({
        ...selectedDiscussion,
        replies: [...selectedDiscussion.replies, newReply],
      });
    }

    setReplyContent('');
    toast({ title: 'Reply posted successfully' });
  };

  const subjects = ['Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering'];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Discussions"
        subtitle="Ask questions and share knowledge"
        breadcrumbs={[
          { label: 'Knowledge', path: '/knowledge/discussions' },
          { label: 'Discussions' },
        ]}
        actions={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Discussion
          </button>
        }
      />

      <KnowledgeNavBar />

      {/* Discussion List */}
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="section-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 
                  className="font-semibold text-lg hover:text-primary cursor-pointer"
                  onClick={() => setSelectedDiscussion(discussion)}
                >
                  {discussion.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="info">{discussion.subject}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {discussion.author}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(discussion.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground line-clamp-2">{discussion.content}</p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {discussion.likes}
              </button>
              <button 
                onClick={() => setSelectedDiscussion(discussion)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {discussion.replies.length} replies
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Discussion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start New Discussion"
        size="lg"
      >
        <form onSubmit={handleNewPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={newPost.subject}
              onChange={(e) => setNewPost({ ...newPost, subject: e.target.value })}
              className="input-field"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="input-field"
              placeholder="What's your question?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="input-field min-h-[150px]"
              placeholder="Provide more details..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" className="btn-primary">Post Discussion</button>
          </div>
        </form>
      </Modal>

      {/* Discussion Detail Modal */}
      <Modal
        isOpen={!!selectedDiscussion}
        onClose={() => {
          setSelectedDiscussion(null);
          setReplyContent('');
        }}
        title={selectedDiscussion?.title || ''}
        size="lg"
      >
        {selectedDiscussion && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="info">{selectedDiscussion.subject}</Badge>
              <span>{selectedDiscussion.author}</span>
              <span>â€¢</span>
              <span>{formatDate(selectedDiscussion.createdAt)}</span>
            </div>

            <p className="text-foreground">{selectedDiscussion.content}</p>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-4">Replies ({selectedDiscussion.replies.length})</h4>
              
              {selectedDiscussion.replies.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {selectedDiscussion.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{reply.author}</span>
                        <span className="text-sm text-muted-foreground">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mb-4">No replies yet. Be the first to respond!</p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="input-field flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply(selectedDiscussion.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleReply(selectedDiscussion.id)}
                  className="btn-primary px-4"
                  disabled={!replyContent.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


